module Main(input [3:0] keydata, input keypressed, input clk, output reg VALID, output reg INVALID);

  parameter [1:0] WAITKEY = 2'b00;
  parameter [1:0] WAITRELEASE = 2'b01;
  parameter [1:0] EVALUATE = 2'b10;
  
  reg[1:0] state;
  reg[1:0] next_state;
  
  reg[3:0] R1, R2, R3, R4;
  reg[2:0] count;
  
  initial begin
    state <= WAITKEY;
    R1 <= 0;
    R2 <= 0;
    R3 <= 0;
    R4 <= 0;
    count <= 0;
  end
 
  
  always @ (posedge clk or posedge keypressed) begin
    case(state)
      
      WAITKEY:
        begin
          if(count == 4)
            state = EVALUATE;
          else if(keypressed == 1)
            state = WAITRELEASE;
          else
            state = WAITKEY;
        end
      
      WAITRELEASE:
        begin
          if(count == 4)
            state = EVALUATE;
          else if(keypressed == 0)
            state = WAITKEY;
          else
            state = WAITRELEASE;
        end
      
      EVALUATE:
        begin
          if(count == 0) begin
            state = WAITKEY;
          end
        end
    endcase
  end
  
  always @ (posedge keypressed or state == 2) begin
    case(state)
      WAITKEY:
        begin
          if(count == 0) begin
            R1 <= 0;
            R2 <= 0;
            R3 <= 0;
            R4 <= 0;
          end
        end
          
      
      WAITRELEASE:
        begin
          $display("waitrelease");
          if(count == 0) begin
            R1 <= keydata;
          end
          else if(count == 1) begin
            R2 <= keydata;
          end
          else if(count == 2) begin
            R3 <= keydata;
          end
          else if(count == 3) begin
            R4 <= keydata;
          end
          count <= count + 1;
        end
      
      EVALUATE:
        begin
          if( (R1 == 1) && (R2 == 2) && (R3 == 3) && (R4 == 4) ) begin
            VALID = 1;
            INVALID = 0;
          end
          else begin
            VALID = 0;
            INVALID = 1;
          end
          count <= 0;
        end
    endcase
  end
endmodule      