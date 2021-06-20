<?php
$db = mysqli_connect('localhost','root','','mydb');
if($db->connect_errno > 0){
    die('Unable to connect to database [' . $db->connect_Error . ']');
}

$list = $db->query("SELECT * FROM delivery");

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
        <td>Delivery ID</td>
        <td>Customer ID</td>
        <td>Total Price</td>
    </tr>
    <?php
    foreach($list as $element)
    {
        echo "<tr><td>".$element["deliveryID"]."</td> <td>".$element["custID"]."</td> <td>".$element["totalPrice"]; 
        echo "<td><a href='delete.php?id=".$element["deliveryID"]."&route=delivery'>DELETE</a></td>";
        
        echo "</tr>";

    }
    ?>
<table>


<hr />
<form action = "insert.php" method="POST">
    <p1>deliveryID&nbsp;&nbsp;:&nbsp;</p1><input type="number" name="deliveryID"><br>
    <p1>custID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;</p1><input type="text" name="custID"><br>
    <p1>totalPrice&nbsp;:&nbsp;</p1><input type="text" name="totalPrice"><br>
    <input type="hidden" name="route" value="delivery">
    <button class="button" onclick="window.location='delivery.php'">INSERT</button>
</form>


<br>

<form action = "delivery-select.php" method="POST">
    <p1>deliveryID</p1><input type="number" name="deliveryID">
    <select name="deliveryIDdropdown">
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
    <p1>totalPrice</p1><input type="number" name="totalPrice"><br>
    <select name="totalPricedropdown">
        <option value=""></option>
        <option value=">">></option>
        <option value="<"><</option>
        <option value="=">=</option>
    </select><br>
    <input type="hidden" name="route" value="delivery">
    <button class="button" onclick="window.location='delivery-select.php'">SELECT</button>
</form>
</div>
</head>
<body>