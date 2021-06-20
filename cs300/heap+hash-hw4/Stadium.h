#include <fstream>
#include <ostream>
#include "pq.h"

/* TAHIR TURGUT			27035		CS300		HW4				*/

using namespace std;

//struct to store block row and column of specific seat
struct seat
{
	string block;
	string row;
	int column;

	seat::seat(string b, string r, int c): block(b), row(r), column(c){};	//parameter constructor
	seat::seat(): block(""), row(""), column(-1){};							//default constructor
	
	bool operator==(const seat &rhs) const {								//operator to check equality of seats
		return (block == rhs.block && row == rhs.row && column == rhs.column);
	}
};

struct Hasher		//provides an hash function to structs (by using already defined hashing)
{
	size_t operator()(const seat& seat) const{
		return ( hash<string>()(seat.block) ^ hash<string>()(seat.row) ^ hash<int>()(seat.column) );}
};

//class to store stadium's seats and its customers
class Stadium{
private:
	unordered_map<seat, string, Hasher> stadium;		//hashes seats to customers
	unordered_map<string, seat> cust_hash;				//hashes customers to seats (to find customer quickly)
	vector<string> block_order, row_order;				//contains the inputted order of blocks, rows and col size (prioritizing them)
	int col_size;
	unordered_map<string, minheap> row_heaps;			//hashtable of rows and min heap of that specific row

	ofstream outfile;									//to print messages into a txt file
public:
	Stadium(vector<string> blocks, vector<string> rows, int col_num, const string &outfile_name);	//parameter constructor
	~Stadium();				//to close the file appropriately
	void print();			//This command will print out the current stadium state.
	void reserve_seat_by_row(string cus, string row);			//This function will reserve a seat for the customer in a particular row
	void reserve_seat(string cus, string block, string row, int col_num);	//This function will reserve the specific seat for the customer
	void get_seat(string cus);			//Print out to the output text file the reserved seat of the customer
	void cancel_reservation(string cus);	//If a customer has a reservation in the stadium, cancels their reservation
};