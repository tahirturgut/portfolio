#include <iostream>
#include <string>
#include "my_heap.h"

/* TAHIR TURGUT			27035		CS300		HW1				*/

using namespace std;

//parameter constructor of memory_block struct
memory_block::memory_block(memory_block *r, memory_block *l, bool u, int sz, int add){
	right = r;
	left = l;
	used = u;
	size = sz;
	starting_address = add;
}

//default constructor of My_heap class (empty heap)
My_heap::My_heap()
{
	heap_begin = nullptr;
	blk = nullptr;
	used_bytes = 0;
}

//destructor
My_heap::~My_heap()
{
	memory_block *temp = heap_begin;
	int leak = get_usedMemory();				//take the current used memory before they are deleted

	//delete each of the node until confront with blk
	while (heap_begin != nullptr){
		temp = heap_begin->right;
		delete heap_begin;
		heap_begin = temp;
	}

	//report the leak
	cout << "At destruction, the heap had a memory leak of " << leak << " bytes" << endl;
}

//function to assign new nodes to the end of the heap, with given size
memory_block *My_heap::bump_allocate(int num_bytes)
{
	//create a new heap memory at the beginning
	memory_block *tmp = new memory_block;
	tmp->size = num_bytes;
	
	//if my_heap is empty, make it heap_begin and blk at the same time
	if (heap_begin == nullptr){
		tmp->starting_address = 0;
		heap_begin = tmp;
		blk = tmp;
		used_bytes = num_bytes;
		return tmp;
	}
	else{

		//if there is no capacity to arrange a block for that size, simply delete the temp and return nullptr
		if (used_bytes+num_bytes > MAX_CAPACITY){
			delete tmp;
			return nullptr;}
		
		else{
			//if there is a node already and capacity is enough, push the new node to the end, make it tail(blk)
			blk->right = tmp;
			tmp->left = blk;
			tmp->starting_address = (blk->starting_address+blk->size);
			used_bytes += num_bytes;
			blk = tmp;
			return tmp;}
	}
}

//function to mark specific node as free
void My_heap::deallocate(memory_block* block_address){
	memory_block *temp = heap_begin;

	//search until list ends
	while (temp != nullptr)
	{
		//if selected nodes are the same (if its found)
		if (temp == block_address){

			//assign it as free block
			block_address->used = false;

			//check the right surrounding
			if ( (block_address->right != nullptr) && (block_address->right)->used == false){
				temp = block_address->right;
				block_address->size += temp->size;
				block_address->right = temp->right;
				if (temp == blk)
					blk = block_address;
				else
					(temp->right)->left = block_address;

				//since 2 nodes are merged, to avoid leak, delete one of them 
				delete temp;
			}

			//check the left surrounding
			if ( (block_address->left != nullptr) && (block_address->left)->used == false){
				temp = block_address->left;
				temp->size += block_address->size;
				temp->right = block_address->right;
				if (block_address != blk)
					(block_address->right)->left = temp;

				//since 2 nodes are merged, to avoid leak, delete one of them 
				delete block_address;
			}
			break;		//do not search anymore
		}

		//if they are not matched, move one node forward
		else
			temp = temp->right;
	}
}

//function to assign data to heap node that currently free and exist (if its capacity is enough)
memory_block* My_heap::first_fit_allocate(int num_bytes)
{
	memory_block *temp = heap_begin;

	//go until the end of the heap
	while (temp != nullptr){

		//if the current node is free (used == false)
		if (temp->used == false){

			//if its size is enough make that node used and return that node
			if (temp->size >= num_bytes){
				temp->used = true;
				return temp;
			}
		}

		//move one forward
		temp = temp->right;
	}

	//if there is no free node or free nodes' capacities are not enough, create a new node and push it to the end
	return (bump_allocate(num_bytes));
}

//function to assign data to heap node that currently free and exist (if its capacity is enough) 
//with the least wasted memory
memory_block *My_heap::best_fit_allocate(int num_bytes)
{
	memory_block *temp = heap_begin, *best_fit_temp;
	int diff = INT_MAX;										//goal is minimize the difference

	//until the end of the heap
	while (temp != nullptr){

		//check whether that node is free or not
		if (temp->used == false){

			//if it's size is enough, compare the min diff and current dif
			if (temp->size >= num_bytes){
				if (diff > temp->size - num_bytes){
					diff = temp->size - num_bytes;
					best_fit_temp = temp;}
			}
		}
		temp = temp->right;
	}

	//if any node exist with higher or equal capacity, make it used and return that node
	if (diff != INT_MAX){
		best_fit_temp->used = true;
		return best_fit_temp;}

	//otherwise push another node to the end of the heap
	else
		return (bump_allocate(num_bytes));
}

//function to assign data to heap node that currently free and exist (if its capacity is enough) 
//and split the wasted memory into another node
memory_block *My_heap::first_fit_split_allocate(int num_bytes)
{
	memory_block *temp = heap_begin;

	//until the heap's end
	while (temp != nullptr)
	{
		//if the current node is free, compare capacities
		if (temp->used == false)
		{
			//if the capacities are equal, simply make the node used and return it
			if (temp->size == num_bytes){
				temp->used = true;
				return temp;
			}

			//if the capacity is larger than it should be, split it by necessary units (needed, size-needed)
			else if (temp->size > num_bytes){

				//create a new heap pointer (with constructor), to assign reminder free memory to it
				memory_block *to_create = new memory_block(temp->right, temp, false, 
					temp->size - num_bytes, temp->starting_address + num_bytes);
				if (temp == blk)
					blk = to_create;
				else
					(temp->right)->left = to_create;
				temp->right = to_create;
				temp->size = num_bytes;
				temp->used = true;
				return temp;
			}
		}
		temp = temp->right;
	}

	//if there is no node that has enough capacity, push a new node to the end
	return (bump_allocate(num_bytes));
}

//function to calculate fragmantation rate
float My_heap::get_fragmantation(){
	memory_block *temp = heap_begin;

	//biggestFree is the biggest free memory node and last block is the remaining part from the nodes
	int biggestFree = 0, usedMemory = 0, last_block = MAX_CAPACITY;

	//go until the end of the heap
	while (temp != nullptr){

		//if current node is free, compare its size with current biggest free node size
		if (temp->used == false){
			if (temp->size > biggestFree)
				biggestFree = temp->size;
		}

		//if it is used, add that into used memory count
		else
			usedMemory += temp->size;

		last_block -= temp->size;
		temp = temp->right;
	}

	//compare the remaining block (512-heap_size) with the biggest free existed
	if (last_block > biggestFree)
		biggestFree = last_block;

	//return the fragmantation rate
	float freeMemory = (MAX_CAPACITY - usedMemory);
	return ( (freeMemory - biggestFree ) / (freeMemory) * 100 );
}

//function to display current nodes and some properties
void My_heap::print_heap(){
	memory_block *temp = heap_begin;
	string str, hexa;
	int countFree = 0, countUsed = 0, index = 0;

	//check all nodes to count used and free nodes
	while (temp != nullptr){
		if (temp->used == true)
			countUsed++;
		else
			countFree++;
		temp = temp->right;
	}
	cout << "Maximum capacity of heap: 512B" << endl
		<< "Currently used memory (B): " << get_usedMemory() << endl
		<< "Total memory blocks: " << countFree + countUsed << endl
		<< "Total used memory blocks: " << countUsed << endl
		<< "Total free memory blocks: " << countFree << endl
		<< "Fragmentation:  " << (*this).get_fragmantation() << "%" << endl
		<< "------------------------------" << endl;
	temp = heap_begin;

	//to display each node go node by node
	while (temp != nullptr){
		if (temp->used == true)
			str = "True";
		else
			str = "False";
		cout << "Block " << index << "\t\tUsed: " << str << "\tSize (B): " 
			<< temp->size << "\tStarting Address: 0x" << std::hex << temp->starting_address << std::dec << endl;
		temp = temp->right;
		index++;
	}
	cout << "------------------------------" << endl
		<< "------------------------------" << endl;
}

//function to get currently used memory in bytes
int My_heap::get_usedMemory(){
	memory_block *temp = heap_begin;
	int res = 0;

	//check each node and if it is used, add the size of it the to result
	while (temp != nullptr){
		if (temp->used == true)
			res += temp->size;
		temp = temp->right;
	}
	return res;
}