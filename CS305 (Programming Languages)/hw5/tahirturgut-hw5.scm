(define restart-scheme (lambda (env)
	(display "cs305: ERROR")
	(newline)
	(newline)
	(repl env)
))

(define get-operator (lambda (op-symbol env)
  (cond
    ((equal? op-symbol '+) +)
    ((equal? op-symbol '-) -)
    ((equal? op-symbol '*) *)
    ((equal? op-symbol '/) /)
    (else (restart-scheme env)))))

(define operation-stmt? 
  (lambda (e)
	(cond
		((eq? (car e) '+) #t)
		((eq? (car e) '-) #t)
		((eq? (car e) '/) #t)
		((eq? (car e) '*) #t)
		(else #f)
	)
  )
)

(define define-stmt? 
  (lambda (e)
     (and 
       (list? e) 
       (= (length e) 3) 
       (eq? (car e) 'define)
       (symbol? (cadr e))
     )
  )
)

(define if-stmt? 
  (lambda (e)
     (and 
       (list? e) 
       (= (length e) 4) 
       (eq? (car e) 'if)
     )
  )
)

(define cond-stmt? 
  (lambda (e)
     (and 
       (list? e) 
       (eq? (car e) 'cond)
       (not (eq? (length e) 1))
       (not (eq? (length e) 2))
       (cond-check? (cdr e))
     )
  )
)

(define cond-check? 
	(lambda (e)
		(cond
			((null? e) #f)
			((not (and (list? (car e)) (= (length (car e)) 2))) #f)
			((eq? (caar e) 'else) (if (null? (cdr e)) #t #f) )
		       	(else (cond-check? (cdr e)) )
		)
	)
)

(define else-stmt? 
  (lambda (e)
     (and 
       (list? e) 
       (eq? (car e) 'else)
     )
  )
)

(define let-stmt? 
  (lambda (e)
     (and 
       (list? e)
       (eq? (length e) 3) 
       (eq? (car e) 'let)
     )
  )
)

(define let*-stmt? 
  (lambda (e)
     (and 
      	(list? e)
	(eq? (length e) 3)
       	(eq? (car e) 'let*)
     )
  )
)

(define let_binding 
	(lambda (e temp_env env)
		(if (null? e)
			temp_env	
			(if (and (eq? (length (car e)) 2) (symbol? (caar e)))
				(let* (
					(temp_env (update-env (caar e) (cs305-interpret (cadar e) env) temp_env))
					(temp_env (let_binding (cdr e) temp_env env))
				      ) 
					temp_env)
				(restart-scheme env)
			)
		)
	)
)

(define let_expr 
	(lambda (e env)
		(let* ((temp_env env) (temp_env (let_binding (cadr e) temp_env env)))
			(cs305-interpret (caddr e) temp_env)
		)
	)
)

(define let*_binding 
	(lambda (e temp_env)
		(if (null? e)
			temp_env	
			(if (and (eq? (length (car e)) 2) (symbol? (caar e)))
				(let* (
					(temp_env (update-env (caar e) (cs305-interpret (cadar e) temp_env) temp_env))
					(temp_env (let*_binding (cdr e) temp_env))
				      ) 
					temp_env)
				(restart-scheme env)
			)
		)
	)
)

(define let*_expr 
	(lambda (e env)
		(let* ((temp_env env) (temp_env (let*_binding (cadr e) temp_env)))
			(cs305-interpret (caddr e) temp_env)
		)
	)
)


(define conditional 
  (lambda (e env)
	(if (else-stmt? (car e))
		(cadar e)

		(if (list? (car e)) (if (not (eq? (cs305-interpret (caar e) env) 0)) (cadar e) (conditional (cdr e) env)) (restart-scheme env))
	)
  )
)

(define get-value 
   (lambda (var env)
      (cond
        ((null? env) (restart-scheme env))
        ((eq? var (caar env)) (cdar env))
        (else (get-value var (cdr env)))
      )
   )
)

(define unbind
  (lambda (var old-env)
     (cond
       ((null? old-env) '())
       ((eq? (caar old-env) var) (cdr old-env))
       (else (cons (car old-env) (unbind var (cdr old-env))))
     )
  )
)

(define update-env 
  (lambda (var val old-env)
     (cons (cons var val) (unbind var old-env))
  )
)

(define cs305-interpret
	(lambda (e env)
		(cond
			((number? e) e)
      			((symbol? e) (get-value e env) )
      			((not (list? e)) (restart-scheme env) )
      			((if-stmt? e) (if (not (eq? (cs305-interpret (cadr e) env) 0)) (cs305-interpret (caddr e) env) (cs305-interpret (cadddr e) env)) )
      			((cond-stmt? e) (cs305-interpret (conditional (cdr e) env) env) )
      			((let-stmt? e) (let_expr e env) )
      			((let*-stmt? e) (let*_expr e env) )
      			((operation-stmt? e)
        			(let(
           				(operator (get-operator (car e) env))
           				(operands (map cs305-interpret (cdr e) (make-list (length (cdr e)) env)))
          			    )
          				(apply operator operands)
        			)
      			)
      			(else (restart-scheme env) )
		)
	)
)


(define repl 
  (lambda (env)
    (let*
      (
        (dummy1 (display "cs305> "))
        (expr (read))
        (new-env (if (define-stmt? expr)
                     (update-env (cadr expr) (cs305-interpret (caddr expr) env) env)
                     env))
        (val (if (define-stmt? expr)
                 (cadr expr) 
                 (cs305-interpret expr env)))
        (dummy2 (display "cs305: "))
        (dummy3 (display val))
        (dummy4 (newline))
        (dummy5 (newline))
      )
      (repl new-env)
    )
  )
)

(define cs305 (lambda () (repl '())))