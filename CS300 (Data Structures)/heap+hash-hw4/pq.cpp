#include "pq.h"

/* TAHIR TURGUT			27035		CS300		HW4				*/

using namespace std;

minheap::minheap(){
	currentSize = 0;
}

minheap::minheap(int block_num, string row){
	currentSize = 0;
	vector<block_seat> vec(block_num+1);		//since heap starts from 1, not 0.
	heap = vec;
	row_name = row;
}

/* START: MODIFIED CODES FROM THE LECTURE NOTES (HEAPS) */
void minheap::insert(const block_seat &b){
	int hole = ++currentSize;
	for(; hole > 1 && b < heap[hole/2]; hole /= 2){			//percolate up until order is established
		block_location[b.block] = hole;
		heap[hole] = heap[hole/2];}
	heap[hole] = b;
	block_location[b.block] = hole;			//indicate the location of that block in the hashtable
}

void minheap::percolateDown(int hole){
	int child;
	block_seat tmp = heap[hole];

	for( ; hole * 2 <= currentSize; hole = child )				//until the temp is smaller than its childs
	{   
		child = hole * 2;
		if ((child != currentSize) && (heap[child+1] < heap[child]))
			child++;
		if(heap[child] < tmp){
			heap[hole] = heap[child];
			block_location[tmp.block] = child;
			block_location[heap[child].block] = hole;}
		else
			break;
	}
	heap[hole] = tmp;
	block_location[tmp.block] = hole;				//change the location of it
}
/* END: MODIFIED CODES FROM TEH LECTURE NOTES (HEAPS) */

block_seat minheap::GetMin(){
	return(heap[1]);
}

string minheap::GetName(){
	return row_name;
}

void minheap::Add1toBlock(string block_name){
	int loc = block_location[block_name];
	heap[loc].seated++;
	percolateDown(loc);			//reestablish the order by percolatedown
}

void minheap::decreaseSize(string block_name){
	heap[block_location[block_name]].seated--;
	block_seat temp = heap[block_location[block_name]];

	int hole = block_location[block_name];
	for(; hole > 1 && temp < heap[hole/2]; hole /= 2){			///reestablish the order by percolateup
		block_location[heap[hole/2].block] = hole;
		heap[hole] = heap[hole/2];}
	heap[hole] = temp;
	block_location[block_name] = hole;
}