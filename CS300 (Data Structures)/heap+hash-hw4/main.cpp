#include <sstream>
#include "Stadium.h"

/* TAHIR TURGUT			27035		CS300		HW4				*/

using namespace std;

int main()
{
	string inputtxt = "inputs.txt";
	ifstream input(inputtxt);

	if (input.fail()){
		cout << "There is no file called " << inputtxt << ". Please check the name again." << endl;
		return 1;}

	//act free!!! there is no restriction for complexity of building stadium!!!
	vector<string> block_vec, row_vec;
	string str_b, str_r;

	getline(input, str_b);
	istringstream iss_b(str_b);			//create a stringstream of blocks line
    string block;
	 while (iss_b >> block)
		 block_vec.push_back(block);	//assign each block to the vector

	getline(input, str_r);
	istringstream iss_r(str_r);			//create a stringstream of rows line
    string row;
	while (iss_r >> row)
		row_vec.push_back(row);			//assign each row to the vector

	int colnum;
	input >> colnum;
	input.clear();		//to clear error flag of integer inputting

	Stadium stad(block_vec, row_vec, colnum, "output.txt");		//initialize the stadium with those vectors

	string command_line;
	while(getline(input, command_line)){
		istringstream iss_c(command_line);			//take every line and split them down to understand what command is
		string command;
		iss_c >> command;
		if (command == "print")
			stad.print();
		else{
			string cust_name;
			iss_c >> cust_name;

			if (command == "reserve_seat"){
				string block, row;
				int colNum;
				iss_c >> block >> row >> colNum;
				stad.reserve_seat(cust_name, block, row, colNum);
			}

			else if (command == "reserve_seat_by_row") {
				string row;
				iss_c >> row;
				stad.reserve_seat_by_row(cust_name, row);
			}

			else if (command == "cancel_reservation")
				stad.cancel_reservation(cust_name);

			else if (command == "get_seat")
				stad.get_seat(cust_name);
		}
		
	}

	return 0;
}