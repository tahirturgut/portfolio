#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include "hw2.h"

/* TAHIR TURGUT			27035		CS300		HW2				*/

using namespace std;

int main(){

	string citytxt = "cities.txt", queriestxt = "queries.txt", temp_name;
	ifstream city(citytxt), queries(queriestxt);

	//define the size of the system
	int temp_x, temp_y;
	city >> temp_x >> temp_y;

	quadTree tree(nullptr, temp_x, temp_y);
	//define a loop to take line by line info of the cities.txt
	while (city >> temp_name >> temp_x >> temp_y){
		node *n = new node(temp_name, temp_x, temp_y);
		if (tree.inBoundary(temp_x, temp_y))
			tree.pt_insert(n, tree.getRoot());										//this line's city is to be inserted
	}
	city.close();

	//print the quadtree in SE -> SW -> NE -> NW order
	tree.printTree(tree.getRoot());
	cout << endl << endl;

	//read the lines of query.txt in a loop
	string line;
	while (getline(queries, line))
	{
		string visited = "", included = "";				//the cities visited and within the circle of given point and radius
		char comma;
		istringstream iss(line);
		int x_cor, y_cor, radius;
		iss >> x_cor >> comma >> y_cor >> comma >> radius;
		
		tree.pt_search(x_cor, y_cor, radius, tree.getRoot(), visited, included);		//use the recursive function to determine those

		//if there is no city included (there should be visited cities in every case)
		if (included == "")
			included = "<None>  ";
		cout << included.substr(0, included.length() -2) << endl;
		cout << visited.substr(0, visited.length() -2) << endl << endl;
	}
	queries.close();

	return 0;
}