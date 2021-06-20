module TestBench();

  reg clk = 0;
  reg[3:0] keydata;
  reg keypressed;
  wire INVALID, VALID;
 
  Main DUT0( .keydata(keydata), .keypressed(keypressed), .clk(clk), .VALID(VALID), .INVALID(INVALID));
  
  always
    #4 clk = ~clk;
  
 initial begin 
    #15 keydata = 1; keypressed = 1;
    
    #20 keypressed = 0;
    
    #25 keydata = 2; keypressed = 1;
    
    #30 keypressed = 0;
    
    #35 keydata = 3; keypressed = 1;
   
    #40 keypressed = 0;
    
    #45 keydata = 4; keypressed = 1;
    
    #50 keypressed = 0;
   
    if(VALID)
      $display("VALID");
    if(INVALID)
      $display("INVALID");
      
    $finish;
  end
    initial #700 $finish;
   initial
     begin
	$dumpfile("dump.vcd");
	$dumpvars;
     end
  
endmodule
