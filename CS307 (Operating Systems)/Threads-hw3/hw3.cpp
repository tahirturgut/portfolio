#include <iostream>
#include <pthread.h>
#include <stdio.h>
#include <unistd.h>
#include <string>
#include <stdlib.h> 
#include <queue> 
#include <semaphore.h>
using namespace std;

#define NUM_THREADS 10
#define MEMORY_SIZE 150

struct node
{
	int id;
	int size;
};


queue<node> myqueue; // shared que
pthread_mutex_t sharedLock = PTHREAD_MUTEX_INITIALIZER; // mutex
pthread_t server; // server thread handle
sem_t semlist[NUM_THREADS]; // thread semaphores

int thread_message[NUM_THREADS]; // thread memory information
char  memory[MEMORY_SIZE]; // memory size

//to keep track of threads which are used by server function
//and to keep track where empty memory begins
int handledThreadCount = 0, freeIndex = 0;


void my_malloc(int thread_id, int size)
{
	//This function will add the struct to the queue
	node temp;
	temp.id = thread_id;
	temp.size = size;

	pthread_mutex_lock(&sharedLock);	//lock since queue is shared
	myqueue.push(temp);
	pthread_mutex_unlock(&sharedLock); //unlock
}

void * server_function(void *)
{
	//This function should grant or decline a thread depending on memory size.
	while(true){

		pthread_mutex_lock(&sharedLock);	//lock

		if (!myqueue.empty()){							//if the queue is currently empty do nothing
			node toCheck = myqueue.front();				//get the oldest added memory block
			myqueue.pop();
			if (toCheck.size < MEMORY_SIZE - freeIndex){	//check whether there is enough memory for that
				thread_message[toCheck.id] = freeIndex;
				freeIndex += toCheck.size;}
			else
				thread_message[toCheck.id] = -1;			//error flag

			pthread_mutex_unlock(&sharedLock); //unlock
			sem_post(&semlist[toCheck.id]);					//wake up the semaphore of that specific thread
			handledThreadCount++;
		}
		else{
			pthread_mutex_unlock(&sharedLock); //unlock
		}

		if (handledThreadCount == NUM_THREADS) {pthread_exit(NULL);}	//terminate when all threads are done
	}
}


void * thread_function(void *id)
{
	//This function will create a random size, and call my_malloc
	int randSize;
	int *r_id = (int*)id;			//type casting

	randSize = (rand() % (MEMORY_SIZE/6)) + 1;		//random value

	my_malloc(*r_id, randSize);				//call the malloc to be enqueued
	//Block

	sem_wait(&semlist[*r_id]);				//wait until server function iterates that thread

	//Then fill the memory with id's or give an error prompt
	int msg = thread_message[*r_id];
	if (msg > -1){							//if there is no error flag
		pthread_mutex_lock(&sharedLock);	//lock, since char array is shared
		for (int i = msg; i < msg+randSize; i++){memory[i] = '0'+*r_id;}		//fill memory
		pthread_mutex_unlock(&sharedLock); //unlock
	}
	else
		cout << "Thread ID = " << *r_id << ": Not enough memory" << endl << endl;

	pthread_exit(NULL);
}

void init()	 
{
	pthread_mutex_lock(&sharedLock);	//lock
	for(int i = 0; i < NUM_THREADS; i++) //initialize semaphores
	{sem_init(&semlist[i],0,0);}
	for (int i = 0; i < MEMORY_SIZE; i++)	//initialize memory 
  	{char zero = '0'; memory[i] = zero;}
   	pthread_create(&server,NULL,server_function,NULL); //start server 
	pthread_mutex_unlock(&sharedLock); //unlock
}

void dump_memory() 
{
	// You need to print the whole memory array here.
	pthread_mutex_lock(&sharedLock);	//lock, since char array is shared
	for (int i = 0; i < MEMORY_SIZE; i++){
		cout << memory[i] << " ";}
	cout << endl << endl;
	pthread_mutex_unlock(&sharedLock); //unlock
}

int main (int argc, char *argv[])
 {

 	//You need to create a thread ID array here
	pthread_t tIDarr[NUM_THREADS];
	int IDarr[NUM_THREADS];
	for(int i = 0; i < NUM_THREADS; i++){IDarr[i] = i;}

 	init();	// call init

 	//You need to create threads with using thread ID array, using pthread_create()
	for(int i = 0; i < NUM_THREADS; i++)
	{pthread_create(&tIDarr[i],NULL,thread_function,(void*)&IDarr[i]);}

 	//You need to join the threads
	pthread_join(server,NULL);
	for(int i = 0; i < NUM_THREADS; i++)
	{pthread_join(tIDarr[i],NULL);}

	while(handledThreadCount != NUM_THREADS);

 	dump_memory(); // this will print out the memory
 	
 	printf("\nMemory Indexes:\n" );
 	for (int i = 0; i < NUM_THREADS; i++)
 	{
 		printf("[%d]" ,thread_message[i]); // this will print out the memory indexes
 	}
 	printf("\nTerminating...\n");
 }