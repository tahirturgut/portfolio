<?php
    if($_POST)
    {
        $db = mysqli_connect('localhost','root','','mydb');
        if($db->connect_errno > 0){
            die('Unable to connect to database [' . $db->connect_Error . ']');
        }
        $route = $_POST["route"];

        if($route === "products"){
            $data1 = $_POST["productID"];
            $data2 = $_POST["productName"];
            $data3 = $_POST["productQuantity"];
            $data4 = $_POST["productPrice"];
            

            $sql_statement = "INSERT INTO products(productID,productName,productQuantity,productPrice) VALUES('$data1','$data2','$data3','$data4')";
            $result = mysqli_query($db, $sql_statement);
            header("Location: $route.php");
        }
        if($route === "cart"){
            $data1 = $_POST["row_id"];
            $data2 = $_POST["custID"];
            $data3 = $_POST["productID"];
            

            $sql_statement = "INSERT INTO cart VALUES('$data1','$data2','$data3')";
            $result = mysqli_query($db, $sql_statement);
            header("Location: $route.php");
        }
        if($route === "customers"){
            $data1 = $_POST["productID"];
            $data2 = $_POST["productName"];
            $data3 = $_POST["productQuantity"];
            $data4 = $_POST["productPrice"];
            

            $sql_statement = "INSERT INTO products(productID,productName,productQuantity,productPrice) VALUES('$data1','$data2','$data3','$data4')";
            $result = mysqli_query($db, $sql_statement);
            header("Location: $route.php");
        }
        if($route === "delivery"){
            $data1 = $_POST["productID"];
            $data2 = $_POST["productName"];
            $data3 = $_POST["productQuantity"];
            $data4 = $_POST["productPrice"];
            

            $sql_statement = "INSERT INTO products(productID,productName,productQuantity,productPrice) VALUES('$data1','$data2','$data3','$data4')";
            $result = mysqli_query($db, $sql_statement);
            header("Location: $route.php");
        }
        if($route === "ratings"){
            $data1 = $_POST["productID"];
            $data2 = $_POST["productName"];
            $data3 = $_POST["productQuantity"];
            $data4 = $_POST["productPrice"];
            

            $sql_statement = "INSERT INTO products(productID,productName,productQuantity,productPrice) VALUES('$data1','$data2','$data3','$data4')";
            $result = mysqli_query($db, $sql_statement);
            header("Location: $route.php");
        }
    }
?>