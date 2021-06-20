#include <iostream>
#include <vector>
#include <unordered_map>
#include <string>

/* TAHIR TURGUT			27035		CS300		HW4			*/

using namespace std;

//struct to store block name with filled seat number in specific row, input_index indicates the priority of blocks
struct block_seat{
	string block;
	int seated;
	int input_index;
	block_seat::block_seat(string b, int n, int idx): block(b), seated(n), input_index(idx){};		//parameter constructor
	block_seat::block_seat(): block(""), seated(-1){};			//to avoid errors, default constructor

	bool operator<(const block_seat &rhs) const {			//comparison operator, in equality situation check the priority
		if (seated < rhs.seated)
			return true;
		else if (seated == rhs.seated)
			return(input_index < rhs.input_index);
		else
			return false;
	}
};

//class to store least seated block in a row with priority queues
class minheap
{
private:
	int currentSize;								// Number of elements in heap
	vector<block_seat> heap;						// The heap array
	unordered_map<string, int> block_location;		//block name and location hashtable
	string row_name;								//heap of that row

	void percolateDown(int hole);					//to set order of min heap
public:
	minheap();								//default constructor
	minheap(int block_num, string row);		//parameter constructor
	void insert(const block_seat &b);		//This method inserts an block to the min heap
	void Add1toBlock(string block_name);	//This method increments the seated number of specific block
	string GetName();						//This method returns the row
	block_seat GetMin();					//This method returns the block with minimum (or most prior) block
	void decreaseSize(string block_name);	//This method decrement the seated number of specific block
};