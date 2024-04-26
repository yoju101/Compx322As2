<?php
// First connect to the database 
require_once('connection.php'); 

// SQL query to get all the active records from the table
$query = "SELECT `engname`, `info`,`lat`,`lon` FROM `town`";
$result = $con->query($query);

// If there are topics, fetch and store them in an array of objects
$towns = [];
if ($result !== false) {
    while ($row = $result->fetch()) {
        $town = [
            'engname' => $row['engname'],
            'info' => $row['info'],
            'lon'=> $row['lon'],
            'lat' =>  $row['lat']         

        ];
        $towns[] = $town;
    }
} else {
    // If no topics found, return an empty array
    $towns = [];
}

// Encode the array of objects into JSON format
$jsonString = json_encode($towns);
echo $jsonString;

?>

