<?php
    header('Content-Type: application/json');
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_POST['password']) && $_POST['password'] === 'testing') {
            http_response_code(200);
						echo json_encode(array(
							'message' => 'Success',
							'forms' => array(
									'/forms/519630048',
									'/forms/533560002',
									'/forms/563350033',
									'/forms/567490004',
									'/forms/603050002',
							),
							'token' => '1234567890',
						));
        } else {
            http_response_code(403);
        }
    } else {
        http_response_code(405);
    }
?>
