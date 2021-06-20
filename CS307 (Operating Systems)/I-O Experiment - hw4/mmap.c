#include <stdio.h>
#include <sys/mman.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <time.h>


int main()
{
    clock_t tStart = clock();
	int file = open("loremipsum.txt", O_RDONLY);		//open the file as integer
	if(file == NULL)
		printf("Opening file failed, terminating...\n");
    
	else{
		struct stat s;
		size_t size;
		int status = fstat(file, &s);
		size = s.st_size;		//take the size of the file

		char *map = mmap(0,size,PROT_READ,MAP_PRIVATE,file,0);	//it is not shared and opened only for reading
		if(map == MAP_FAILED)
			printf("Mapping Failed\n");			//terminate if mapping fails
		int count = 0;
		size_t i;
		for (i=0; i <= size; i++){			//loop for "size" times, and check the every char of map, whether it is 'a' or not
            if (map[i] == 'a')
				count++;
		}
		printf("Count of char of 'a' is %d\n", count);
		printf("Time taken: %.2fs\n", (double)(clock() - tStart)/CLOCKS_PER_SEC);
	}
	return 0;
}
