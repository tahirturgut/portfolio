%{
#include <stdio.h>
#include "tahirturgut-hw3.h"
#include <string.h>

char BUFFER[100000];
char temp_buffer[1000];

void yyerror (const char *s) 
{}

ChildNode *mkEXPR1Str (char*);
ChildNode *mkEXPR1Int (int);
ChildNode *mkEXPR1Real (float);

ChildNode *mkEXPR3 (ChildNode *, ChildNode *, OprType, int);
ChildNode * root;
void printResult(ChildNode *ptr);

extern int yylineno;
int mismatchFlag = 0;
%}

%union 
{
	char *strvalue;
	int intvalue;
	float realvalue;
	ChildNode *node;
	int lineNo;
}

%token tPRINT tGET tSET tFUNCTION tRETURN tIDENT tEQUALITY tIF tGT tLT tGEQ tLEQ tINC tDEC EOE
%token <strvalue> tSTRING 
%token <intvalue> tNUM 
%token <realvalue> tREAL
%token <lineNo> tADD tSUB tMUL tDIV
%type <node> expr
%type <node> operation

%start prog

%%

prog:		'[' stmtlst ']'
;

stmtlst:	stmtlst stmt |
;

stmt:		setStmt | if | print | unaryOperation | returnStmt
		| expr { printResult($1); }
;

getExpr:	'[' tGET ',' tIDENT ',' '[' exprList ']' ']'
		| '[' tGET ',' tIDENT ',' '[' ']' ']'
		| '[' tGET ',' tIDENT ']'
;

setStmt:	'[' tSET ',' tIDENT ',' expr ']' { printResult($6); }
;

if:		'[' tIF ',' condition ',' '[' stmtlst ']' ']'
		| '[' tIF ',' condition ',' '[' stmtlst ']' '[' stmtlst ']' ']'
;

print:		'[' tPRINT ',' '[' expr ']' ']'		{ printResult($5); }
;

operation:	'[' tADD ',' expr ',' expr ']'		{ $$ = mkEXPR3($4, $6, ADD, $2); }
		| '[' tSUB ',' expr ',' expr ']'	{ $$ = mkEXPR3($4, $6, SUB, $2); }
		| '[' tMUL ',' expr ',' expr ']'	{ $$ = mkEXPR3($4, $6, MUL, $2); }
		| '[' tDIV ',' expr ',' expr ']'	{ $$ = mkEXPR3($4, $6, DIV, $2); }
;	

unaryOperation: '[' tINC ',' tIDENT ']'
		| '[' tDEC ',' tIDENT ']'
;

expr:		tNUM		{ $$ = mkEXPR1Int($1); }
		| tREAL		{ $$ = mkEXPR1Real($1); }
		| tSTRING 	{ $$ = mkEXPR1Str($1); }
		| operation	{ $$ = $1; }
		| getExpr 	{ $$ = NULL; }
		| function 	{ $$ = NULL; }
		| condition	{ $$ = NULL; }
;

function:	 '[' tFUNCTION ',' '[' parametersList ']' ',' '[' stmtlst ']' ']'
		| '[' tFUNCTION ',' '[' ']' ',' '[' stmtlst ']' ']'
;

condition:	'[' tEQUALITY ',' expr ',' expr ']'	{ printResult($4); printResult($6); }
		| '[' tGT ',' expr ',' expr ']'		{ printResult($4); printResult($6); }
		| '[' tLT ',' expr ',' expr ']'		{ printResult($4); printResult($6); }
		| '[' tGEQ ',' expr ',' expr ']'	{ printResult($4); printResult($6); }
		| '[' tLEQ ',' expr ',' expr ']'	{ printResult($4); printResult($6); }
;

returnStmt:	'[' tRETURN ',' expr ']' 	{ printResult($4); }
		| '[' tRETURN ']'
;

parametersList: parametersList ',' tIDENT | tIDENT
;

exprList:	exprList ',' expr | expr
;

%%

float rnd(float val) {
	float temp = val * 100;
	if ( ((int)temp) % 10 >= 5) {
		return ( ( (int)((temp+10)/10) ) / 10.0 ); }
	else
		return (temp / 100);
}

void printResult(ChildNode *ptr) {
	if (ptr != NULL && ptr->exprNode->exprType == EXPR3) {
		if(ptr->exprNode->varType == STR) {
			strcat(BUFFER, "Result of expression on ");
			snprintf(temp_buffer, sizeof BUFFER, "%i", ptr->exprNode->lineNo);
			strcat(BUFFER, temp_buffer);
			strcat(BUFFER, " is (" );
			strcat(BUFFER, ptr->exprNode->strval);
			strcat(BUFFER, ")\n" );
			//printf("Result of expression on %i is (%s)\n", ptr->exprNode->lineNo, ptr->exprNode->strval);
		}
		else if(ptr->exprNode->varType == INT) {
			strcat(BUFFER, "Result of expression on ");
			snprintf(temp_buffer, sizeof BUFFER, "%i", ptr->exprNode->lineNo);
			strcat(BUFFER, temp_buffer);
			strcat(BUFFER, " is (" );
			snprintf(temp_buffer, sizeof BUFFER, "%i", ptr->exprNode->intval);
			strcat(BUFFER, temp_buffer);
			strcat(BUFFER, ")\n" );
			//printf("Result of expression on %i is (%i)\n", ptr->exprNode->lineNo, ptr->exprNode->intval);
		}
		else if(ptr->exprNode->varType == REAL) {
			float nearest = rnd(ptr->exprNode->realval);
			strcat(BUFFER, "Result of expression on ");
			snprintf(temp_buffer, sizeof BUFFER, "%i", ptr->exprNode->lineNo);
			strcat(BUFFER, temp_buffer);
			strcat(BUFFER, " is (" );
			snprintf(temp_buffer, sizeof BUFFER, "%.1f", nearest);
			strcat(BUFFER, temp_buffer);
			strcat(BUFFER, ")\n" );
			//printf("Result of expression on %i is (%.1f)\n", ptr->exprNode->lineNo, nearest);
		}
		else {
			strcat(BUFFER, "Type mismatch on ");
			snprintf(temp_buffer, sizeof BUFFER, "%i", ptr->exprNode->lineNo);
			strcat(BUFFER, temp_buffer);
			strcat(BUFFER, "\n" );
			//printf("Type mismatch on %i\n", ptr->exprNode->lineNo); 
			mismatchFlag = 1;
		}
	}
	else
		mismatchFlag = 1;
}
char *mulStr(char *str, int k)
{
    int i, j;
    int len = strlen(str);
    char *res = (char *) malloc(sizeof(char) * (len * k + 1));

    for (i = 0, j = 0; i < (len * k); i++, j++)
    {
            if (j == len) j = 0;

            res[i] = str[j];
    }
    res[i] = '\0';
    return res;
}
ChildNode *mkEXPR1Int(int val) {
	ChildNode *ptr = (ChildNode *)malloc (sizeof(ChildNode));
	ptr->varType = INT;
	ptr->exprNode = (ExprNode *)malloc (sizeof(ExprNode));
	ptr->exprNode->intval = val;
	ptr->exprNode->varType = INT;
	ptr->exprNode->exprType = EXPR1;
	return (ptr);
}

ChildNode *mkEXPR1Real(float val) {
	ChildNode *ptr = (ChildNode *)malloc (sizeof(ChildNode));
	ptr->varType = REAL;
	ptr->exprNode = (ExprNode *)malloc (sizeof(ExprNode));
	ptr->exprNode->realval = val;
	ptr->exprNode->varType = REAL;
	ptr->exprNode->exprType = EXPR1;
	return (ptr);
}

ChildNode *mkEXPR1Str(char * val) {
	ChildNode *ptr = (ChildNode *)malloc (sizeof(ChildNode));
	ptr->varType = STR;
	ptr->exprNode = (ExprNode *)malloc (sizeof(ExprNode));
	ptr->exprNode->strval = val;
	ptr->exprNode->varType = STR;
	ptr->exprNode->exprType = EXPR1;
	return (ptr);
}

ChildNode *mkEXPR3 ( ChildNode *left, ChildNode *right, OprType opr, int lineNo) {
	if (left == NULL || right == NULL)
		return NULL;
	int c;
	ChildNode *ptr = (ChildNode *)malloc (sizeof(ChildNode));
	VarType leftType, rightType;
	leftType = left->exprNode->varType;
	rightType = right->exprNode->varType;
	ptr->exprNode = (ExprNode *)malloc (sizeof(ExprNode));
	ptr->exprNode->varType = NDEF;
	ptr->exprNode->exprType = EXPR3;
	ptr->exprNode->lineNo = lineNo;

	if(opr == ADD) {
		if ( leftType == INT && rightType == INT ) {
			ptr->exprNode->intval = left->exprNode->intval + right->exprNode->intval;
			ptr->exprNode->varType = INT;
		}
		else if ( leftType == REAL && rightType == REAL ) {
			ptr->exprNode->realval = left->exprNode->realval + right->exprNode->realval;
			ptr->exprNode->varType = REAL;
		}
		else if ( leftType == REAL && rightType == INT ) {
			ptr->exprNode->realval = left->exprNode->realval + right->exprNode->intval;
			ptr->exprNode->varType = REAL;
		}
		else if ( leftType == INT && rightType == REAL ) {
			ptr->exprNode->realval = left->exprNode->intval + right->exprNode->realval;
			ptr->exprNode->varType = REAL;
		}
		else if ( leftType == STR && rightType == STR ) {
			ptr->exprNode->strval = strcat(left->exprNode->strval, right->exprNode->strval);
			ptr->exprNode->varType = STR;
		}
	}
	else if (opr == SUB) {
		if ( leftType == INT && rightType == INT ) {
			ptr->exprNode->intval = left->exprNode->intval - right->exprNode->intval;
			ptr->exprNode->varType = INT;
		}
		else if ( leftType == REAL && rightType == REAL ) {
			ptr->exprNode->realval = left->exprNode->realval - right->exprNode->realval;
			ptr->exprNode->varType = REAL;
		}
		else if ( leftType == REAL && rightType == INT ) {
			ptr->exprNode->realval = left->exprNode->realval - right->exprNode->intval;
			ptr->exprNode->varType = REAL;
		}
		else if ( leftType == INT && rightType == REAL ) {
			ptr->exprNode->realval = left->exprNode->intval - right->exprNode->realval;
			ptr->exprNode->varType = REAL;
		}
	}
	else if (opr == MUL) {
		if ( leftType == INT && rightType == INT ) {
			ptr->exprNode->intval = left->exprNode->intval * right->exprNode->intval;
			ptr->exprNode->varType = INT;
		}
		else if ( leftType == REAL && rightType == REAL ) {
			ptr->exprNode->realval = left->exprNode->realval * right->exprNode->realval;
			ptr->exprNode->varType = REAL;
		}
		else if ( leftType == REAL && rightType == INT ) {
			ptr->exprNode->realval = left->exprNode->realval * right->exprNode->intval;
			ptr->exprNode->varType = REAL;
		}
		else if ( leftType == INT && rightType == REAL ) {
			ptr->exprNode->realval = left->exprNode->intval * right->exprNode->realval;
			ptr->exprNode->varType = REAL;
		}
		else if ( leftType == INT && rightType == STR && left->exprNode->intval >= 0) {
			ptr->exprNode->strval = mulStr(right->exprNode->strval,left->exprNode->intval);
			ptr->exprNode->varType = STR;
		}
	}
	else if (opr == DIV) {
		if ( leftType == INT && rightType == INT ) {
			ptr->exprNode->intval = left->exprNode->intval / right->exprNode->intval;
			ptr->exprNode->varType = INT;
		}
		else if ( leftType == REAL && rightType == REAL ) {
			ptr->exprNode->realval = left->exprNode->realval / right->exprNode->realval;
			ptr->exprNode->varType = REAL;
		}
		else if ( leftType == REAL && rightType == INT ) {
			ptr->exprNode->realval = left->exprNode->realval / right->exprNode->intval;
			ptr->exprNode->varType = REAL;
		}
		else if ( leftType == INT && rightType == REAL ) {
			ptr->exprNode->realval = left->exprNode->intval / right->exprNode->realval;
			ptr->exprNode->varType = REAL;
		}
	}
	return(ptr);
}

int main ()
{

	if (yyparse()) {
		if (!mismatchFlag)
			printf("ERROR\n");
		return 1;
	}
	else {
		// successful parsing
		printf("%s", BUFFER);
		return 0;
	}
}
