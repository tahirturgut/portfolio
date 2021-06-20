<?php
$db = mysqli_connect('localhost','root','','mydb');
if($db->connect_errno > 0){
    die('Unable to connect to database [' . $db->connect_Error . ']');
}

$list = $db->query("SELECT * FROM customers");

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
        <td>Customer ID</td>
        <td>Customer Name</td>
        <td>Customer Mail</td>
        <td>Customer Password</td>
    </tr>
    <?php
    foreach($list as $element)
    {
        echo "<tr><td>".$element["custID"]."</td> <td>".$element["custName"]."</td> <td>".$element["custMail"]."</td> <td>".$element["password"]."</td>"; 
        echo "<td><a href='delete.php?id=".$element["custID"]."&route=customers'>DELETE</a></td>";
        
        echo "</tr>";

    }
    ?>
<table>


<hr />
<form action = "insert.php" method="POST">
    <p1>custID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;</p1><input type="number" name="custID"><br>
    <p1>custName&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;</p1><input type="text" name="custName"><br>
    <p1>custMail&nbsp;:&nbsp;</p1><input type="text" name="custMail"><br>
    <p1>password&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;</p1><input type="number" name="password"><br>
    <input type="hidden" name="route" value="customers">
    <button class="button" onclick="window.location='customers.php'">INSERT</button>
</form>
<br>
<form action = "customers-select.php" method="POST">
    <p1>custID</p1><input type="number" name="custID">
    <select name="custIDdropdown">
        <option value=""></option>
        <option value=">">></option>
        <option value="<"><</option>
        <option value="=">=</option>
    </select><br>
    <p1>custName:</p1><input type="text" name="custName">
    <select name="custNamedropdown">
        <option value=""></option>
        <option value="includes">includes</option>
        <option value="equals">equals</option>
    </select><br>
    <p1>custMail:</p1><input type="text" name="custMail">
    <select name="custMaildropdown">
        <option value=""></option>
        <option value="includes">includes</option>
        <option value="equals">equals</option>
    </select><br>
    <input type="hidden" name="route" value="customers">
    <button class="button" onclick="window.location='customers-select.php'">SELECT</button>
</form>
</div>

</head>
<body>