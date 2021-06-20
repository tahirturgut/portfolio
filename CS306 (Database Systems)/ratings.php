<?php
$db = mysqli_connect('localhost','root','','mydb');
if($db->connect_errno > 0){
    die('Unable to connect to database [' . $db->connect_Error . ']');
}

$list = $db->query("SELECT * FROM ratings");

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
        <td>Rating ID</td>
        <td>Customer ID</td>
        <td>Rating Value</td>
        <td>Product ID</td>
    </tr>
    <?php
    foreach($list as $element)
    {
        echo "<tr><td>".$element["ratingID"]."</td> <td>".$element["custID"]."</td> <td>".$element["ratingValue"]."</td> <td>".$element["productID"]."</td>"; 
        echo "<td><a href='delete.php?id=".$element["ratingID"]."&route=ratings'>DELETE</a></td>";
        
        echo "</tr>";

    }
    ?>
<table>


<hr />
<form action = "insert.php" method="POST">
    <p1>ratingID&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;</p1><input type="number" name="ratingID"><br>
    <p1>custID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;</p1><input type="text" name="custID"><br>
    <p1>ratingValue&nbsp;:&nbsp;</p1><input type="text" name="ratingValue"><br>
    <p1>productID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;</p1><input type="number" name="productID"><br>
    <input type="hidden" name="route" value="ratings">
    <button class="button" onclick="window.location='ratings.php'">INSERT</button>
</form>
<br>

<form action = "ratings-select.php" method="POST">
    <p1>ratingID</p1><input type="number" name="ratingID">
    <select name="ratingIDdropdown">
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
    <p1>ratingValue</p1><input type="number" name="ratingValue">
    <select name="ratingValuedropdown">
        <option value=""></option>
        <option value=">">></option>
        <option value="<"><</option>
        <option value="=">=</option>
    </select><br>
    <p1>productID</p1><input type="number" name="productID">
    <select name="productIDdropdown">
        <option value=""></option>
        <option value=">">></option>
        <option value="<"><</option>
        <option value="=">=</option>
    </select><br>
    <input type="hidden" name="route" value="ratings">
    <button class="button" onclick="window.location='ratings-select.php'">SELECT</button>
</form>
</div>
</head>
<body>