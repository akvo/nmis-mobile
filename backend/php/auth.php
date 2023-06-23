<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['code']) && $_POST['code'] === 'testing123') {
        $json_dir = __DIR__ . '/json';
        $json_files = glob($json_dir . '/*.json');
        $form_list = [];
        foreach ($json_files as $json_file) {
            $contents = file_get_contents($json_file);
            $form = json_decode($contents, true);
            $form_list[] = [
                'id'      => $form['id'],
                'url'     => '/forms/' . $form['id'],
                'version' => $form['version'],
            ];
        }
        http_response_code(200);
        echo json_encode(array(
            'message' => 'Success',
            'formsUrl' => $form_list,
            'syncToken' => 'Bearer eyjtoken',
        ));
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid credentials"]);
    }
} else {
    http_response_code(405);
}
