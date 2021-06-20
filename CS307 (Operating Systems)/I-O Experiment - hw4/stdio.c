#include <stdio.h>
#include <time.h>


int main()
{
    clock_t tStart = clock();
    FILE *fp ;
    fp = fopen("loremipsum.txt", "r");		//open the file
	if(fp == NULL)
		printf("\Opening file failed, terminating...\n");		//if it cannot be opened, terminate
	else{
		char ch;
		int count = 0;
		while (!feof(fp)){			//until reaching the end of file,
            ch = getc(fp);
            if (ch == 'a')		//check each char and if it is 'a' increment the count by 1
				count++;
		}
		printf("\Count of char of 'a' is %d\n", count);
		printf("Time taken: %.2fs\n", (double)(clock() - tStart)/CLOCKS_PER_SEC);
	}
	return 0;
}
