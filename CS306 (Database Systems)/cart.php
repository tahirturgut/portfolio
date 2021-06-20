<?php
$db = mysqli_connect('localhost','root','','mydb');
if($db->connect_errno > 0){
    die('Unable to connect to database [' . $db->connect_Error . ']');
}

$list = $db->query("SELECT * FROM cart");

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

<div align="center">
<table>
    <tr>
        <td>Row ID</td>
        <td>Customer ID</td>
        <td>Product ID</td>
    </tr>
    <?php
    foreach($list as $element)
    {
        echo "<tr><td>".$element["row_id"]."</td> <td>".$element["custID"]."</td> <td>".$element["productID"]."</td>"; 
        echo "<td><a href='delete.php?id=".$element["row_id"]."&route=cart'>DELETE</a></td>";
        
        echo "</tr>";

    }
    ?>
<table>


<hr />
<form action = "insert.php" method="POST">
    <p1>row_id&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;</p1><input type="number" name="row_id"><br>
    <p1>custID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;</p1><input type="number" name="custID"><br>
    <p1>productID&nbsp;:&nbsp;</p1><input type="number" name="productID"><br>
    <input type="hidden" name="route" value="cart">
    <button class="button" onclick="window.location='cart.php'">INSERT</button>
</form>
<br>

<form action = "cart-select.php" method="POST">
<p1>row_id</p1><input type="number" name="row_id">
    <select name="row_iddropdown">
        <option value=""></option>
        <option value=">">></option>
        <option value="<"><</option>
        <option value="=">=</option>
    </select><br>
    <p1>custID</p1><input type="number" name="custID">
    <select name="custIDdropdown">
        <option value=""></option>
        <option value=">">></option>
        <option value="<"><</option>
        <option value="=">=</option>
    </select><br>
    <p1>productID&nbsp;:&nbsp;</p1><input type="number" name="productID">
    <select name="productIDdropdown">
        <option value=""></option>
        <option value=">">></option>
        <option value="<"><</option>
        <option value="=">=</option>
    </select><br>
    <input type="hidden" name="route" value="cart">
    <button class="button" onclick="window.location='cart-select.php'">SELECT</button>
</form>


</div>
</head>
<body>