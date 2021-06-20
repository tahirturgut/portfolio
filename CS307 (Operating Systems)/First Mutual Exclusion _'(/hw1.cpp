#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

using namespace std;

//define global variables of plane seats(matrix), turn semaphore, the number of remaining seats, and number of terminated threads
int matrix[2][50];
int turn = 0;
int remaining_seats = 100;

//function which is going to be used as thread, Agency 1's schedule
void *TravelAgency1(void *)
{
	//infinite loop
	while (true)
	{
		//busywaiting till Agency 2 gives the turn
		while(turn != 0){};

		//report that critical region (global variables) is in use right now
		printf("%s \n", "Agency 1 entered the critical region");

		if (remaining_seats == 0){

			//report that critical region is not longer in use
			printf("%s \n", "Agency 1 exit the critical region\n");

			//give the turn to other agency
			turn = 1;
			pthread_exit(NULL);
		}

		//create a random number between 0-99
		int randnum = (rand() % 100);

		//random number's division by 50 is 1 or 0 which is row of plane seat matrix
		//reminder of division by 50 is the column of plane seat matrix
		//check that specific seat is 0 (empty) or not
		if (matrix[randnum/50][randnum%50] == 0){

			//fill empty seat with agency number and decrement remaining seat number by 1
			matrix[randnum/50][randnum%50] = 1;
			remaining_seats--;
			printf("Seat Number %i %s", randnum+1, " is reserved by Agency 1\n");
		}
			
		//report that critical region is not longer in use
		printf("%s \n", "Agency 1 exit the critical region\n");

		//give the turn to other agency
		turn = 1;
	}
}

//function which is going to be used as thread, Agency 2's schedule
void *TravelAgency2(void *)
{
	//infinite loop
	while (true)
	{
		//busywaiting till Agency 1 gives the turn
		while(turn != 1){};

		//report that critical region (global variables) is in use right now
		printf("%s \n", "Agency 2 entered the critical region");

		if (remaining_seats == 0){

			//report that critical region is not longer in use
			printf("%s \n", "Agency 2 exit the critical region\n");

			//give the turn to other agency
			turn = 0;
			pthread_exit(NULL);
		}

		//create a random number between 0-99
		int randnum = (rand() % 100);

		//random number's division by 50 is 1 or 0 which is row of plane seat matrix
		//reminder of division by 50 is the column of plane seat matrix
		//check that specific seat is 0 (empty) or not
		if (matrix[randnum/50][randnum%50] == 0){

			//fill empty seat with agency number and decrement remaining seat number by 1
			matrix[randnum/50][randnum%50] = 2;
			remaining_seats--;
			printf("Seat Number %i %s", randnum+1, " is reserved by Agency 2\n");
		}
				
		//report that critical region is not longer in use
		printf("%s \n", "Agency 2 exit the critical region\n");

		//give the turn to other agency
		turn = 0;
		
	}
}

int main()
{
	pthread_t thread1, thread2;

	//assign 0 for all seats of matrix
	for (int i = 0; i < 2; i++){
		for (int j = 0; j < 50; j++){
			matrix[i][j] = 0;
		}
	}

	//create threads from those functions
	pthread_create ( &thread1, NULL, TravelAgency1, NULL);
	pthread_create ( &thread2, NULL, TravelAgency2, NULL);

	//and start them to work with main, in a synchronized way
	pthread_join(thread1, NULL);
	pthread_join(thread2, NULL);

	//busywaiting as main, till plane is full
	while (remaining_seats != 0){};

	//then print the seats
	printf("%s \n", "No seats left\n");
	printf("%s \n", "Plane is full:\n");
	for (int i = 0; i < 2; i++){
		for (int j = 0; j < 50; j++){
			cout <<matrix[i][j] << " ";
		}
		cout << endl;
	}

	return 0;
}