<?php
    if($_GET){
        $db = mysqli_connect('localhost','root','','mydb');
        if($db->connect_errno > 0){
            die('Unable to connect to database [' . $db->connect_Error . ']');
        }
        $route = $_GET["route"];
        $id = $_GET["id"];

        if($route==="products"){
            $sql="DELETE FROM products WHERE productID = '" . $_GET["id"] . "'";
            if (mysqli_query($db, $sql)) {
                echo "Record deleted successfully";
            } else {
                echo "Error deleting record: " . mysqli_error($db);
            }
            mysqli_close($db);
            header("Location: products.php");
        }

        if($route==="customers"){
            $sql="DELETE FROM customers WHERE custID= '" . $_GET["id"] . "'";
            if (mysqli_query($db, $sql)) {
                echo "Record deleted successfully";
            } else {
                echo "Error deleting record: " . mysqli_error($db);
            }
            mysqli_close($db);
            header("Location: customers.php");
        }

        if($route==="cart"){
            $sql="DELETE FROM cart WHERE row_id = '" . $_GET["id"] . "'";
            if (mysqli_query($db, $sql)) {
                echo "Record deleted successfully";
            } else {
                echo "Error deleting record: " . mysqli_error($db);
            }
            mysqli_close($db);
            header("Location: cart.php");
        }

        if($route==="delivery"){
            $sql="DELETE FROM delivery WHERE deliveryID = '" . $_GET["id"] . "'";
            if (mysqli_query($db, $sql)) {
                echo "Record deleted successfully";
            } else {
                echo "Error deleting record: " . mysqli_error($db);
            }
            mysqli_close($db);
            header("Location: delivery.php");
        }

        if($route==="ratings"){
            $sql="DELETE FROM ratings WHERE ratingID = '" . $_GET["id"] . "'";
            if (mysqli_query($db, $sql)) {
                echo "Record deleted successfully";
            } else {
                echo "Error deleting record: " . mysqli_error($db);
            }
            mysqli_close($db);
            header("Location: ratings.php");
        }

    }
?>