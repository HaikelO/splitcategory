<?php
include ('../../../inc/includes.php');

$itilCategories = new PluginSplitCategoryITILCategory();
$categories = $itilCategories->getCategories();

echo json_encode($categories);
