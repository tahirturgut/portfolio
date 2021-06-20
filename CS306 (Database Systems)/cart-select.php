<?php
    if($_POST)
    {
        $db = mysqli_connect('localhost','root','','mydb');
        if($db->connect_errno > 0){
            die('Unable to connect to database [' . $db->connect_Error . ']');
        }
        $route = $_POST["route"];
        
            $data1 = $_POST["row_id"];
            $data2 = $_POST["custID"];
            $data3 = $_POST["productID"];


            $data11 = $_POST["row_iddropdown"];
            $data22 = $_POST["custIDdropdown"];
            $data33 = $_POST["productIDdropdown"];


               $whereArr = array();
               if($data1 != "")       $whereArr[] = "row_id ".$data11." {$data1}";
               if($data2 != "")   $whereArr[] = "custID ".$data22." {$data2}";
               if($data3 != "")   $whereArr[] = "productID ".$data33." {$data3}";


               $whereStr = implode(" AND ", $whereArr);
               $query = "Select * from cart WHERE {$whereStr}";
                echo $query;
               $list = $db->query($query);
    }
?>

<!DOCTYPE html>
<html>
<body style="background-color:#C5C3C6;">

<style>
    p1 {
        font-family: Calibri;
        font-size: 24px;
        color:#212121;
      }
    .button {
        background-color: #AD433E;
        border: none;
        color: #C5C3C6;
        width: 200px;
        padding: 16px 32px;
        text-align: center;
        display: inline-block;
        font-family: Calibri;
        font-size: 16px;
        margin: 8px 8px;
        cursor: pointer;
      }
</style>
<head>
    <title>MAIN PAGE</title>


<table>
    <tr>
        <td>ID</td>
        <td>Name</td>
        <td>Quantity</td>
        <td>Price</td>
    </tr>
    <?php
    foreach($list as $element)
    {
        echo "<tr><td>".$element["row_id"]."</td> <td>".$element["custID"]."</td> <td>".$element["productID"]."</td>"; 
        echo "<td><a href='delete.php?id=".$element["row_id"]."'>DELETE</a></td>";
        
        echo "</tr>";

    }
    ?>
<table>

<button class="button" onclick="window.location='products.php'">Back to cart</button>