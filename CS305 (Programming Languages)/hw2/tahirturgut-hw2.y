%{
#include <stdio.h>
void yyerror(char *msg)
{
  printf("");
}
%}
%token tSTRING tGET tSET tFUNCTION tPRINT tIF tRETURN tINC tDEC tGT tEQUALITY 
%token tLT tLEQ tGEQ tIDENT tNUM tADD tSUB tMUL tDIV
%start program
%%

program : '[' stmt_list ']'
	| '[' ']'
;

stmt_list : stmt stmt_list
          | stmt
;

stmt : set_stmt
     | if_stmt
     | print_stmt
     | incr_stmt
     | decr_stmt
     | return_stmt
     | expr
;

set_stmt : '[' tSET ',' tIDENT ',' expr ']'
;

if_stmt : '[' tIF ',' condition ',' '[' ']' ']'
        | '[' tIF ',' condition ',' '[' stmt_list ']' ']'
        | '[' tIF ',' condition ',' '[' ']' '[' ']' ']'
        | '[' tIF ',' condition ',' '[' stmt_list ']' '[' ']' ']'
        | '[' tIF ',' condition ',' '[' ']' '[' stmt_list ']' ']'		
        | '[' tIF ',' condition ',' '[' stmt_list ']' '[' stmt_list ']' ']'
;

print_stmt : '[' tPRINT ',' '[' expr ']' ']'
;

incr_stmt : '[' tINC ',' tIDENT ']'
;

decr_stmt : '[' tDEC ',' tIDENT ']'
;

condition : '[' tGT ',' expr ',' expr ']'
          | '[' tEQUALITY ',' expr ',' expr ']'
          | '[' tLT ',' expr ',' expr ']'
          | '[' tLEQ ',' expr ',' expr ']'
          | '[' tGEQ ',' expr ',' expr ']'
;

expr : tNUM
     | tSTRING
     | func_expr
     | get_expr
     | operator_expr
     | condition
;

get_expr : '[' tGET ',' tIDENT ']'
         | '[' tGET ',' tIDENT ',' '[' ']' ']'
         | '[' tGET ',' tIDENT ',' '[' get_param ']' ']'
;

get_param : expr ',' get_param
	  | expr
;

func_expr : '[' tFUNCTION ',' '[' ']' ',' '[' ']' ']'
	  | '[' tFUNCTION ',' '[' func_parameters ']' ',' '[' ']' ']'
	  | '[' tFUNCTION ',' '[' ']' ',' '[' stmt_list ']' ']'
	  | '[' tFUNCTION ',' '[' func_parameters ']' ',' '[' stmt_list ']' ']'
;

func_parameters : tIDENT ',' func_parameters
		| tIDENT
;


operator_expr : '[' tADD ',' expr ',' expr ']'
              | '[' tSUB ',' expr ',' expr ']'
              | '[' tMUL ',' expr ',' expr ']'
              | '[' tDIV ',' expr ',' expr ']'
;

return_stmt : '[' tRETURN ']'
            | '[' tRETURN ',' expr ']'
;

%%

int main ()
{
  if (yyparse())
  {
    printf("ERROR\n");
    return 1;
  }
  else
  {
    printf("OK\n");
    return 0;
  }
}
