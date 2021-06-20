#include <iostream>
#include "hw2.h"
#include <string>

/* TAHIR TURGUT			27035		CS300		HW2				*/

using namespace std;

//function to insert given node to the root, via detecting its location relatively
void quadTree::pt_insert(node *p, node *&r){

	//we are at the leaf which node should be inserted
	if (r == nullptr)
		r = p;
	//if it is not empty leaf, so compare with current node again recursively
	else{
		if (p->x >= r->x && p->y >= r->y)
			pt_insert(p, r->NE);
		else if (p->x >= r->x && p->y < r->y)
			pt_insert(p, r->SE);
		else if (p->x < r->x && p->y >= r->y)
			pt_insert(p, r->NW);
		else
			pt_insert(p, r->SW);
	}
}

//recursive function to print nodes in the intended order
void quadTree::printTree(node *n){
	if (n == nullptr)
		return;
	cout << n->city_name << endl;
	printTree(n->SE);
	printTree(n->SW);
	printTree(n->NE);
	printTree(n->NW);
}

//function to search specific zones of root if the given circle includes cities or not
void quadTree::pt_search(int x_cor, int y_cor, int radius, node *n, string &vis, string &inc){

	//do not search any deeper zone because there is not
	if (n == nullptr)
		return;

	//determine the points of smallest square which encircles the circle within the system (limited by x and y max)
	int down = y_cor - radius, up = y_cor + radius;
	int left = x_cor - radius, right = x_cor + radius;
	//count the city as visited
	vis = vis + (n->city_name) + ", ";
	
	//necessary if else loops to determine location of the root according to circle 
	//(by book definition area numbers)
	if (n->x > right){
		if (n->y > up){
			//3
			pt_search(x_cor, y_cor, radius, n->SW, vis, inc);
		}
		else if (n->y <= down){
			//8
			pt_search(x_cor, y_cor, radius, n->NW, vis, inc);
		}
		else{
			//5
			pt_search(x_cor, y_cor, radius, n->SW, vis, inc);
			pt_search(x_cor, y_cor, radius, n->NW, vis, inc);
		}
	}
	else if (n->x <= left){
		if (n->y > up){
			//1
			pt_search(x_cor, y_cor, radius, n->SE, vis, inc);
		}
		else if (n->y <= down){
			//6
			pt_search(x_cor, y_cor, radius, n->NE, vis, inc);
		}
		else{
			//4
			pt_search(x_cor, y_cor, radius, n->SE, vis, inc);
			pt_search(x_cor, y_cor, radius, n->NE, vis, inc);
		}
	}
	else{
		if (n->y > up){
			//2
			pt_search(x_cor, y_cor, radius, n->SE, vis, inc);
			pt_search(x_cor, y_cor, radius, n->SW, vis, inc);
		}
		else if (n->y <= down){
			//7
			pt_search(x_cor, y_cor, radius, n->NE, vis, inc);
			pt_search(x_cor, y_cor, radius, n->NW, vis, inc);
		}
		else{
			float dist = sqrt(abs((n->x - x_cor)*(n->x - x_cor) + (n->y - y_cor)*(n->y - y_cor)) );
			if ( dist <= radius){
				//13
				inc = inc + (n->city_name) + ", ";
				pt_search(x_cor, y_cor, radius, n->SE, vis, inc);
				pt_search(x_cor, y_cor, radius, n->SW, vis, inc);
				pt_search(x_cor, y_cor, radius, n->NE, vis, inc);
				pt_search(x_cor, y_cor, radius, n->NW, vis, inc);
			}
			else{
				if (x_cor > n->x){
					if (y_cor > n->y){
						//11
						pt_search(x_cor, y_cor, radius, n->SE, vis, inc);
						pt_search(x_cor, y_cor, radius, n->NE, vis, inc);
						pt_search(x_cor, y_cor, radius, n->NW, vis, inc);
					}
					else{
						//9
						pt_search(x_cor, y_cor, radius, n->SE, vis, inc);
						pt_search(x_cor, y_cor, radius, n->SW, vis, inc);
						pt_search(x_cor, y_cor, radius, n->NE, vis, inc);
					}
				}
				else{
					if (y_cor > n->y){
						//12
						pt_search(x_cor, y_cor, radius, n->SW, vis, inc);
						pt_search(x_cor, y_cor, radius, n->NE, vis, inc);
						pt_search(x_cor, y_cor, radius, n->NW, vis, inc);
					}
					else{
						//10
						pt_search(x_cor, y_cor, radius, n->SE, vis, inc);
						pt_search(x_cor, y_cor, radius, n->SW, vis, inc);
						pt_search(x_cor, y_cor, radius, n->NW, vis, inc);
					}
				}
			}
		}
	}
}

//function to recursively delete the quadsubtrees until leaves
void destructor(node *root){
	if (root->SE != nullptr){
		destructor(root->SE);
		delete root->SE;}
	if (root->SW != nullptr){
		destructor(root->SW);
		delete root->SW;}
	if (root->NE != nullptr){
		destructor(root->NE);
		delete root->NE;}
	if (root->NW != nullptr){
		destructor(root->NW);
		delete root->NW;}
}

quadTree::~quadTree(){
	destructor(root);
	delete root;
}

node *&quadTree::getRoot(){
	return root;
}

//function to check whether given point is in square or not
bool quadTree::inBoundary(int x, int y){
	if (x <= X_MAX && y <= Y_MAX)
		return true;
	else
		return false;
}