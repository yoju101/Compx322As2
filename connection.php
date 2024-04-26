
<?php
//home connection code 

	//replace username with your username e.g. xyz12  in both places
	// and password with your password
   
   try{
   	
   	$con = new PDO('mysql:host=localhost;dbname=sqldb','root','');
   	} catch (PDOException $e) {
   		echo "Database connection error " . $e->getMessage();
   	}
//uni connection code 
// try{
// $con = new PDO('mysql:host=learn-mysql.cms.waikato.ac.nz;dbname=yv4','yv4','my217158sql');
// } catch (PDOException $e) {
// echo "Database connection error ". $e->getMessage();
// }