#include <iostream>
#include <vector>
#include <string>

/* TAHIR TURGUT			27035		CS300		HW3			*/

using namespace std;

template <class Comparable>
struct Item
{
	Item(){}		//default constructor
	Item(Comparable val, int lab) :value(val), label(lab){}		//parameter constructor

	Comparable value;
	int label;
};

template <class Comparable>
class MPQ
{
private:
	int currentSize;					// Number of elements in heap
	vector<Item<Comparable>> heap;      // The heap array
	vector<int> location;				//the location of label's array

	void percolateDown(int hole);		//to set order of max heap
public:
	MPQ(int capacity);					//parameter constructor
	~MPQ();								//destructor
	void insert(const Comparable &value, int label);	//This method inserts an item with the given value and label into the MPQ
	Comparable Remove(int label);						//This method removes the value withthis label and returns it.
	Comparable GetMax();								//This method returns the maximum value that is currently stored.
	bool IsEmpty();					//check if it is empty
};

/* START: MODIFIED CODES FROM THE LECTURE NOTES (HEAPS) */
template <class Comparable>
void MPQ<Comparable>::insert(const Comparable &value, int label){
	Item<Comparable> tmp(value, label);
	int hole = ++currentSize;					//create a hole to insert
	for(;hole > 1 && value > heap[hole/2].value; hole /= 2){
		location[heap[hole/2].label] = hole;			//iterate until the max order is established
		heap[hole] = heap[hole / 2];}

	heap[hole] = tmp;
	location[label] = hole;			//swap the necessary items and locations, respectively
}

template <class Comparable>
Comparable MPQ<Comparable>::Remove(int label){
	if(!IsEmpty()){
		Item<Comparable> item = heap[location[label]];			//detect the item that will be deleted
		heap[location[label]] = heap[currentSize--];			//change it with last element
		percolateDown(location[label]);							//estabilsh the max order
		return item.value;
	}
	else{
		Item<Comparable> null(0,0);
		return null.value;}
}

template <class Comparable>
void MPQ<Comparable>::percolateDown(int hole){
	int child;
	Item<Comparable> tmp = heap[hole];		//detect the item that will be percolated down
       
	for(;hole * 2 <= currentSize; hole = child)
	{
		child = hole * 2;
		if(child != currentSize && heap[child + 1].value > heap[child].value)
			child++;  // child is the minimum of the children
		if(heap[child].value > tmp.value){
			heap[hole] = heap[child]; // swap hole and min child
			location[heap[hole].label] = child;
			location[heap[child].label] = hole;}
		else
			break;
	}
	heap[hole] = tmp;  
	location[heap[hole].label] = hole; // place tmp in its final position
}
/* END: MODIFIED CODES FROM TEH LECTURE NOTES (HEAPS) */

template <class Comparable>
Comparable MPQ<Comparable>::GetMax(){
	int maxx = heap[0].value;					//check the values and determine the max
	for (int i = 1; i < currentSize+1; i++){
		if (maxx < heap[i].value)
			maxx = heap[i].value;
	}
	return maxx;
}

template <class Comparable>
bool MPQ<Comparable>::IsEmpty(){
	if (currentSize == 0)			//if there is no element
		return true;
	else
		return false;
}

template <class Comparable>
MPQ<Comparable>::MPQ(int capacity){
	currentSize = 0;
	vector<Item<Comparable>> vec(capacity+1);		//since heap starts from 1, not 0.
	vector<int> loc(capacity+1);
	heap = vec;
	location = loc;
}

template <class Comparable>
MPQ<Comparable>::~MPQ(){
	currentSize = 0;
	heap.clear();				//clear the vectors and set size as 0
	location.clear();
}