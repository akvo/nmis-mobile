<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['code']) && $_POST['code'] === 'testing123') {
        http_response_code(200);
        echo json_encode(array(
            'message' => 'Success',
            'formsUrl' => array(
                ["id" => 519630048, "url" => '/forms/519630048', "version" => "1.0.0"],
                ["id" => 533560002, "url" => '/forms/533560002', "version" => "1.0.0"],
                ["id" => 563350033, "url" => '/forms/563350033', "version" => "1.0.0"],
                ["id" => 567490004, "url" => '/forms/567490004', "version" => "1.0.0"],
                ["id" => 603050002, "url" => '/forms/603050002', "version" => "1.0.0"],
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
