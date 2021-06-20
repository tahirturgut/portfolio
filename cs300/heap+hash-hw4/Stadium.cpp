#include "Stadium.h"

/* TAHIR TURGUT			27035		CS300		HW4				*/

using namespace std;

Stadium::Stadium(vector<string> blocks, vector<string> rows, int col_num, const string &outfile_name){
	block_order = blocks; row_order = rows; col_size = col_num; outfile.open(outfile_name);

	//initialize each seat with empty customer O(B*R*C)
	for (unsigned int i = 0; i < blocks.size(); i++){
		for (unsigned int j = 0; j < rows.size(); j++){
			for (int k = 0; k < col_num; k++){
				seat temp_seat(blocks[i], rows[j], k);
				stadium[temp_seat];
			}
		}
	}

	//initialize minheap for each row and hash them to find easily
	for (unsigned int a = 0; a < rows.size(); a++){
		minheap tmp_heap(blocks.size(), rows[a]);
		for (unsigned int b = 0; b < blocks.size(); b++){
			block_seat tempp(blocks[b], 0, b);
			tmp_heap.insert(tempp);
		}
		row_heaps[rows[a]] = tmp_heap;
	}
}

Stadium::~Stadium(){
	outfile.close();
}

//complexity is O(B*R*C) in worst, average and best case
void Stadium::print(){
	outfile << endl;
	for (unsigned int i = 0; i < block_order.size(); i++){			//B times
		outfile << block_order[i] << endl << "~~~~~~~" << endl;
		for (unsigned int j = 0; j < row_order.size(); j++){		//B*R times
			outfile << row_order[j] << " :";
			for (int k = 0; k < col_size; k++){						//B*R*C times
				seat temp_seat(block_order[i], row_order[j], k);
				string customer = stadium[temp_seat];
				if (customer.empty())						//print "---" if seat is free
					outfile << " " << "---";
				else
					outfile << " " << customer.substr(0,3);
			}
			outfile << endl;
		}
		outfile << "=======" << endl << endl;
	}
}

//In total O(logB) for adding 1 to a specific block and O(C) for checking each column => complexity = O(logB+C)
void Stadium::reserve_seat_by_row(string cus, string row){
	
	block_seat minBlock = row_heaps[row].GetMin();		//get the least filled block in that row

	//If the reservation fails, either because the seat is full or because the customer already has a reservation, print out:
	if (minBlock.seated == col_size || cust_hash.find(cus) != cust_hash.end())
		outfile << cus << " could not reserve a seat!" << endl;

	else
	{
		row_heaps[row].Add1toBlock(minBlock.block);		//because of the percolatedown's O(logB)
		for (int i = 0; i < col_size; i++){				//check each column in the row whether it is empty or not, O(C)
			seat temp_seat(minBlock.block, row, i);
			if (stadium[temp_seat].empty()){
				stadium[temp_seat] = cus;			//assign that seat to customer
				cust_hash[cus] = temp_seat;			//hash that customer with that seat
				outfile << cus << " has reserved " << minBlock.block << " " << row << "-" << i << " by emptiest block" << endl;
				break;}
		}
	}
		
}

//Incrementing the value of minimum block of that row takes O(logB) times, because of the percolatingdown operation
void Stadium::reserve_seat(string cus, string block, string row, int col_num){
	seat temp_seat(block, row, col_num);	//create a seat struct 
	if (cust_hash.find(cus) == cust_hash.end() && stadium[temp_seat].empty()){	//check conditions
		stadium[temp_seat] = cus;			//assign that seat for that customer
		cust_hash[cus] = temp_seat;			//hash that customer with that seat
		minheap temp_minheap = row_heaps[row];
		temp_minheap.Add1toBlock(block);	//increment the filled seat number of that block in that row's min heap, O(logB)
		row_heaps[row] = temp_minheap;		//update the heap
		outfile << cus << " has reserved " << block << " " << row << "-" << col_num << endl;
	}

	//If the reservation fails, either because the seat is full or because the customer already has a reservation, print out:
	else
		outfile << cus << " could not reserve a seat!" << endl;
}

//no further iterations, constant time = O(1)
void Stadium::get_seat(string cus){
	if (cust_hash.find(cus) != cust_hash.end()){		//check condition
		seat temp_seat = cust_hash[cus];
		//Print out to the output text file the reserved seat of the customer ”customre_name” in the following format:
		outfile << "Found that " << cus << " has a reservation in " << temp_seat.block << " " << temp_seat.row << "-" << temp_seat.column << endl;
	}
	else
		//If a customer with the name ”customer_name” does not have a reservation, print out to the output text file:
		outfile << "There is no reservation made for " << cus <<"!" << endl;
}

//only reestablish the order of min heap of that row, O(logB)
void Stadium::cancel_reservation(string cus){
	//If a customer with the name ”customer_name” has a reservation in the stadium, cancels their reservation, makes their seat, and prints to the output file:
	if (cust_hash.find(cus) != cust_hash.end()){	//if customer is found
		seat temp_seat = cust_hash[cus];
		cust_hash.erase(cus);			//delete him/her from customer list
		stadium.erase(temp_seat);		//delete the seat first
		stadium[temp_seat];				//then replace it with empty version
		row_heaps[temp_seat.row].decreaseSize(temp_seat.block);		//decrement the size of specific block, O(logB) 
		outfile << "Cancelled the reservation of " << cus << endl;
	}
	else
		//If the customer “customre_name” doesn’t have a reservation, prints to the output file:
		outfile << "Could not cancel the reservation for " << cus << "; no reservation found!" << endl;
}