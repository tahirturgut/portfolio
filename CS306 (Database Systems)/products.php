<?php
$db = mysqli_connect('localhost','root','','mydb');
if($db->connect_errno > 0){
    die('Unable to connect to database [' . $db->connect_Error . ']');
}

$list = $db->query("SELECT * FROM products");

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
        <td>ID</td>
        <td>Name</td>
        <td>Quantity</td>
        <td>Price</td>
    </tr>
    <?php
    foreach($list as $element)
    {
        echo "<tr><th>".$element["productID"]."</th> <th>".$element["productName"]."</th> <th>".$element["productQuantity"]."</th> <th>".$element["productPrice"]."</th>"; 
        echo "<th><a href='delete.php?id=".$element["productID"]."&route=products'>DELETE</a></th>";
        
        echo "</tr>";

    }
    ?>
<table>


<hr />

<div style="float: flex;">
<form action = "insert.php" method="POST">
    <tr>
    <p1>productID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;</p1><input type="number" name="productID"><br>
    <p1>productName&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;</p1><input type="text" name="productName"><br>
    <p1>productQuantity&nbsp;:&nbsp;</p1><input type="text" name="productQuantity"><br>
    <p1>productPrice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;</p1><input type="number" name="productPrice"><br>
    <input type="hidden" name="route" value="products">
    <button class="button" onclick="window.location='products.php'">INSERT</button>
    </tr>
</form>

<br>

<form action = "products-select.php" method="POST">
<tr>
    <p1>productID:</p1><input type="name" name="productID">
    <select name="productIDdropdown">
        <option value=""></option>
        <option value=">">></option>
        <option value="<"><</option>
        <option value="=">=</option>
    </select><br>
    <p1>productName:</p1><input type="text" name="productName">
    <select name="productNamedropdown">
        <option value=""></option>
        <option value="includes">includes</option>
        <option value="equals">equals</option>
    </select><br>
    <p1>productQuantity:</p1><input type="number" name="productQuantity">
    <select name="productQuantitydropdown">
        <option value=""></option>
        <option value=">">></option>
        <option value="<"><</option>
        <option value="=">=</option>
    </select><br>
    <p1>productPrice:</p1><input type="number" name="productPrice">
    <select name="productPricedropdown">
        <option value=""></option>
        <option value=">">></option>
        <option value="<"><</option>
        <option value="=">=</option>
    </select><br>
    <input type="hidden" name="route" value="products">
    <button class="button" onclick="window.location='products-select.php'">SELECT</button>
</tr>
</form>
</div>
</head>
<body>