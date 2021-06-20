#include <string>
#include <fstream>
#include <time.h>

using namespace std;

int main()
{
	clock_t tStart = clock();
	ifstream loremipsum;
	loremipsum.open("loremipsum.txt");		//open the file with given name
	if(loremipsum.fail())
		printf("\Opening file failed, terminating...\n");		//terminate if there is a problem in opening file
	else{
		char ch;
		int count = 0;
		while (loremipsum.get(ch)){			//get each character
			if (ch == 'a')
				count++;		//increment the count if it is 'a'
		}
		printf("\Count of char of 'a' is %d\n", count);
		printf("Time taken: %.2fs\n", (double)(clock() - tStart)/CLOCKS_PER_SEC);		//show the time it lasts
	}
	return 0;
}