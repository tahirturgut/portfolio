#include <fstream>
#include <algorithm>
#include "MPQ.h"

/* TAHIR TURGUT			27035		CS300		HW3				*/

using namespace std;

//struct to store label number, x coordinate, height and boolean whether it's right or left edge
struct building{
	int label, x, height;
	bool end;
	building(int x_cor, int lbl, int h, bool endd): x(x_cor), label(lbl), height(h), end(endd) {}
	bool operator<(building rhs) { return this->x < rhs.x; }		//to sort easily
};

int main()
{
	string inputtxt = "input.txt";
	ifstream input(inputtxt);

	if (input.fail())
		cout << "There is no file called " << inputtxt << ". Please check the name again." << endl;

	else{

		//define the size of the vectors
		int capacity;
		input >> capacity;
		MPQ<int> skyline(capacity);

		vector<building> buildingedges;
		//define a loop to take line by line info
		for (int i = 0; i < capacity; i++){
			int left, height, right;
			input >> left >> height >> right;			//append them into a vector of structs
			building b_left(left, i+1, height, false), b_right(right, i+1, height, true);
			buildingedges.push_back(b_left); buildingedges.push_back(b_right);
		}
		input.close();

		sort(buildingedges.begin(), buildingedges.end());		//sort the vector by the x coordinates

		//whether the starting point is height 0 or not
		if(!buildingedges.empty()){
			if(buildingedges[0].x != 0){
				cout << "0 0" << endl;}}

		//some values to keep track of skyline
		int oldx = 0, oldheight = 0, currheight = 0, currx = 0;
		for (int a = 0; a < buildingedges.size(); a++){

			if(currx == buildingedges[a].x){					//if we stuck in the same x coordinate
																//wait until maxiumum height is determined
				if(currheight < buildingedges[a].height)
					currheight = buildingedges[a].height;}
			else{
				if (oldheight != currheight)					//if finally we moved on towards right, print the recent x and height
					cout << currx << " " << currheight << endl;
				oldheight = currheight;
				if (currheight < buildingedges[a].height){		//change the curr and old height if necessary
					currheight = buildingedges[a].height;}
				currx = buildingedges[a].x;						//in every case, this is the x coordinate most recently iterated
			}


			if (!buildingedges[a].end)
			{
				skyline.insert(buildingedges[a].height, buildingedges[a].label);	//insert to the heap if it is left
			}
			else
			{
				int removedvalue = skyline.Remove(buildingedges[a].label);			//remove from heap if it is right edge
				oldheight = currheight;
				if ((!skyline.IsEmpty()) && (oldheight > skyline.GetMax())){		//change the currheight if the removed one is higher
					currheight = skyline.GetMax();
					currx = buildingedges[a].x;}
				else if (skyline.IsEmpty()){
					currheight = 0;
					currx = buildingedges[a].x;}
			}	
		}
		cout << currx << " 0" << endl;			//print where our coordinates stopped
	}

	return 0;
}