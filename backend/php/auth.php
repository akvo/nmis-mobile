<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['code']) && $_POST['code'] === 'testing123') {
        http_response_code(200);
        echo json_encode(array(
            'message' => 'Success',
            'formsUrl' => array(
                '/forms/519630048',
                '/forms/533560002',
                '/forms/563350033',
                '/forms/567490004',
                '/forms/603050002',
            ),
            'syncToken' => 'Bearer eyjtoken',
        ));
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid credentials"]);
    }
} else {
    http_response_code(405);
}
