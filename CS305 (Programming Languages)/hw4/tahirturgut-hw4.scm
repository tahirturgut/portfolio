(define twoOperatorCalculator
	(lambda (e)
		( if (null? (cdr e))	
			(car e)
			(if (eq? '+ (car (cdr e)))
				(twoOperatorCalculator(cons (+ (car e)(caddr e)) (cdddr e) ))
				(if (eq? '- (car (cdr e)))
					(twoOperatorCalculator(cons (- (car e)(caddr e)) (cdddr e) ))
					(list (car e)(cadr e)(twoOperatorCalculator(cddr e)))
		)))
))	


(define fourOperatorCalculator
	(lambda (e)
		( if (null? (cdr e))	
			(list (car e))
			(if (eq? '* (car (cdr e)))
				(fourOperatorCalculator(cons (* (car e)(caddr e)) (cdddr e) ))
				(if (eq? '/ (car (cdr e)))
					(fourOperatorCalculator(cons (/ (car e)(caddr e)) (cdddr e) ))
					(append (list (car e)(cadr e)) (fourOperatorCalculator(cddr e)))
		)))
))	


(define calculatorNested
	(lambda (e)
		(if (null? (cdr e))
			(if (list? (car e)) 
				(list (twoOperatorCalculator (fourOperatorCalculator (calculatorNested (car e)))))
				(list (car e))
      			)
      			(if (list? (car e)) 
				(append (list (twoOperatorCalculator (fourOperatorCalculator (calculatorNested (car e)))) (cadr e)) (calculatorNested (cddr e)))
				(append (list (car e) (cadr e)) (calculatorNested (cddr e))))
			)
		)
))


(define checkOperators
	(lambda (e)
		(cond
			( (null? e)
				#f
			)
			( (not(list? e))
				#f
			)
			( (null? (cdr e))
				(if (list? (car e)) 
					(checkOperators(car e))
					(if (number? (car e)) #t #f)
				)
			)
			( (not(null? (cddr e)) )
				( cond
					((eq? (cadr e) '+) 
						(if (list? (car e)) 
							(if (checkOperators(car e))
								(checkOperators (cddr e))
								#f
							)
							(checkOperators (cddr e))
						)
					)
					((eq? (cadr e) '-) 
						(if (list? (car e)) 
							(if (checkOperators(car e))
								(checkOperators (cddr e))
								#f
							)
							(checkOperators (cddr e))
						)
					)
					((eq? (cadr e) '/) 
						(if (list? (car e)) 
							(if (checkOperators(car e))
								(checkOperators (cddr e))
								#f
							)
							(checkOperators (cddr e))
						)
					)
					((eq? (cadr e) '*) 
						(if (list? (car e)) 
							(if (checkOperators(car e))
								(checkOperators (cddr e))
								#f
							)
							(checkOperators (cddr e))
						)
					)
					(else #f)
				)
			)
			( else #f)
		)
))



(define calculator 
	(lambda (e) 
		(if (checkOperators e)
			(if (list? (fourOperatorCalculator(calculatorNested e)))
				(twoOperatorCalculator(fourOperatorCalculator(calculatorNested e)))
				(twoOperatorCalculator(list (fourOperatorCalculator(calculatorNested e))))
			)
			#f
		)
))
