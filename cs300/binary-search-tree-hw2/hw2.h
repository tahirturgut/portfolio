#include <iostream>
#include <string>

/* TAHIR TURGUT			27035		CS300		HW2				*/

using namespace std;

// a struct that contains name of the city, x and y coordinates and the 4 other cities based on location
struct node{
	string city_name;
	int x, y;
	node *NW, *NE, *SW, *SE;

	//parameter constructor to implement x and y coordinates, as well as the name at the same time
	node(string n, int xcor, int ycor, node *ne = nullptr, node *se = nullptr, 
		node *sw = nullptr, node *nw = nullptr) : city_name(n), x(xcor), y(ycor), 
		NW(nw), NE(ne), SW(sw), SE(se) {}
};

class quadTree{
private:
	node *root;
	int X_MAX, Y_MAX;
public:
	void pt_insert(node *p, node *&r);
	void printTree(node *n);
	void pt_search(int x_cor, int y_cor, int radius, node *n, string &vis, string &inc);
	~quadTree();
	quadTree(node *r, int x, int y) : root(r), X_MAX(x), Y_MAX(y) {};
	node *&getRoot();
	bool inBoundary(int x, int y);
};