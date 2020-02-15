<?php

$json = file_get_contents('php://input');
$data = json_decode($json, true);

print_r($data);