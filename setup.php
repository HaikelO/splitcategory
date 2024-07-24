<?php
include_once 'inc/itilcategory.class.php';

function plugin_init_splitcategory() {
    global $PLUGIN_HOOKS;

    $PLUGIN_HOOKS['csrf_compliant']['splitcategory'] = true;
    $PLUGIN_HOOKS['add_javascript']['splitcategory'] = 'js/splitcategory.js';

    Plugin::registerClass('PluginSplitcategoryITILCategory');
}



function plugin_version_splitcategory() {
    return [
        'name' => 'Split Category',
        'version' => '1.0.0',
        'author' => 'Haikel Ouaghrem',
        'license' => 'GPLv2+',
        'homepage' => 'https://yourwebsite.com',
    ];
}