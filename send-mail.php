<?php
/**
 * Easy Breezy Laundry - Form Mailer
 * Handles both Quote requests and Job Applications
 */

// Allow CORS for development (Remove or adjust $allow_origin for production security)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

// Destination email
$to = "ezbreezylaundry@gmail.com";

// Get JSON data from POST
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    // If not JSON, try standard POST
    $data = $_POST;
}

// Basic Validation
if (empty($data['email'])) {
    echo json_encode(['status' => 'error', 'message' => 'Email is required.']);
    exit;
}

// Determine form type and build message
$formType = isset($data['formType']) ? $data['formType'] : 'General Inquiry';
$subject = "New " . $formType . " from Easy Breezy Website";

$message = "You have received a new " . $formType . ".\n\n";

if ($formType === "Quote Request") {
    $message .= "--- Quote Details ---\n";
    $message .= "Business: " . ($data['businessName'] ?? 'N/A') . "\n";
    $message .= "Contact Name: " . ($data['name'] ?? 'N/A') . "\n";
    $message .= "Email: " . $data['email'] . "\n";
    $message .= "Phone: " . ($data['phone'] ?? 'N/A') . "\n";
    $message .= "Weekly Weight: " . ($data['weight'] ?? 'N/A') . " lbs\n";
} else if ($formType === "Job Application") {
    $message .= "--- Applicant Details ---\n";
    $message .= "Name: " . ($data['firstName'] ?? '') . " " . ($data['lastName'] ?? '') . "\n";
    $message .= "Email: " . $data['email'] . "\n";
    $message .= "Phone: " . ($data['phone'] ?? 'N/A') . "\n";
    $message .= "Availability: " . ($data['availability'] ?? 'N/A') . "\n";
    $message .= "Message: " . ($data['message'] ?? 'N/A') . "\n";
} else {
    // Generic fields
    foreach ($data as $key => $value) {
        if ($key !== 'formType') {
            $message .= ucfirst($key) . ": " . $value . "\n";
        }
    }
}

$headers = "From: webmaster@easybreezylaundry.com\r\n";
$headers .= "Reply-To: " . $data['email'] . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
if (mail($to, $subject, $message, $headers)) {
    echo json_encode(['status' => 'success', 'message' => 'Thank you! Your inquiry has been sent.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Sorry, we encountered a problem sending your message. Please call us directly.']);
}
?>
