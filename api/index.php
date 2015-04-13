<?php

require '../Slim/Slim.php';     //include the framework in the project

\Slim\Slim::registerAutoloader();       //register the autoloader

$app = new \Slim\Slim(array(

   // 'templates.path' => '/usr/local/HelloSlim/Views'
));      //instantiate a new Framework Object and define the path to the folder that holds the views for this project

$app = \Slim\Slim::getInstance();
// ---- Requires

//require '../$appDir/routes/session.php'; //Session management routes   (e.g. log in, log out, register) 
//require '../$appDir/routes/member.php'; //Member routes
//require '../$appDir/routes/admin.php'; //Admin routes

// set default conditions for route parameters
\Slim\Route::setDefaultConditions(array(
		'id' => '[0-9]{1,}',
		'sku'=> '[a-zA-Z-]{3,100}',
));




// --- Rotes

// -------- GET

// example (GET): api/vinhos/

$app->get('/vinhos(/)',function() use($app) {
	//echo "simple starting page";
	$sql = "select * FROM vinho ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		
		// send response header for JSON content type
		$app->response()->header('Content-Type', 'application/json');
		
		// return JSON-encoded response body with query results
		echo json_encode($wines);
		
		//echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}	
});


// example (GET): api/vinhos/concha-y-toro

$app->get('/vinhos/:sku',function($sku) use($app) {
	
	$sql = "select * from vinho where sku =:sku";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam(":sku", $sku, PDO::PARAM_STR);
		$stmt->execute();
		$wine = $stmt->fetchObject();
		$db = null;
		
		// send response header for JSON content type
		$app->response()->header('Content-Type', 'application/json');
		
		echo json_encode($wine);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
	
});


// example (GET): api/vinhos/4

$app->get('/vinhos/:id',function($id) use($app) {

	$sql = "select * from vinho where id =:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam(":id", $id, PDO::PARAM_INT);
		$stmt->execute();
		$wine = $stmt->fetchObject();
		$db = null;

		// send response header for JSON content type
		$app->response()->header('Content-Type', 'application/json');

		echo json_encode($wine);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}

});



// --- PUT

$app->put('/vinhos/:id',function($id) use ($app) {

	$data = json_decode($app->request->getBody());
	
 	$sql = "UPDATE vinhos SET username=:nome,preco=:price,description=:description WHERE id = :id";
 	try {
	 	$db = getConnection();
	 	$stmt = $db->prepare($sql);
	 	$stmt->bindParam("nome", $data->username);
	 	$stmt->bindParam("price", $data->preco);
	 	$stmt->bindParam("description", $data->description);
	 	$stmt->bindParam("id", $id);
	 	$stmt->execute();	
	 	echo json_encode($data);
 	} catch(PDOException $e) {
        echo 'Exception: ' . $e->getMessage();
    }	
	
});

$app->run();                            //load the application


function getConnection() {
	
	$dbhost="";
	$dbuser="";
	$dbpass="";
	$dbname="";
	
	if($_SERVER['REMOTE_ADDR']=="127.0.0.1")
	{
		$dbhost="127.0.0.1";
		$dbuser="root";
		$dbpass="";
		$dbname="redwine";
	}
	
	
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
	$dbh -> exec("set names utf8"); // configura a conexao como utf8 para problemas de acentuacao 
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}


?>
