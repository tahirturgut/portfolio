#ifndef __HW4_H
#define __HW4_H

typedef enum { STR, INT, REAL, NDEF } VarType;

typedef enum { EXPR1, EXPR3 } ExprType;

typedef enum { ADD, SUB, MUL, DIV } OprType;


typedef struct ExprNode {
	int intval;
	float realval;
	char *strval;
	ExprType exprType;
	VarType varType;
	int lineNo;
} ExprNode;


typedef struct ChildNode {
	VarType varType;
	ExprNode *exprNode;
} ChildNode;


#endif
