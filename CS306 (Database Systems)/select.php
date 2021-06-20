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
            $data11 = $_POST["productIDdropdown"];
            $data22 = $_POST["productNamedropdown"];
            $data33 = $_POST["productQuantitydropdown"];
            $data44 = $_POST["productPricedropdown"];
            
               $id = $_POST[id];
               $field1 = $_POST[field1];
               $field2 = $_POST[field2];
               $field3 = $_POST[field3];

               $whereArr = array();
               if($data1 != "")       $whereArr[] = "productID ".$data11." {$data1}";
               if($data2 != "")   $whereArr[] = "productID ".$data22." {$data2}";
               if($data3 != "")   $whereArr[] = "productID ".$data33." {$data3}";
               if($data4 != "")   $whereArr[] = "productID ".$data44." {$data4}";

               $whereStr = implode(" AND ", $whereArr);

               $query = "Select * from products WHERE {$whereStr}";

            $result = mysqli_query($db, $query);
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