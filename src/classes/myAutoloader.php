<?php
/**
 * User: Vilius Kukanauskas, mydata GmbH
 * Package: autoloader
 * Date: 09.01.15
 * Time: 08:35
 * @param String $className
 */
function myAutoloader($className) {
    $className = str_replace('\\', '/', $className);
    //$root = '/home/vk/projects/verwaltung/dm/'; // tests laufen nur wenn root so gegeben ist
    $root='/'; //damit lief die Seite aber vorhin auch.
    $file = $root . $className . '.php';
    if (file_exists($file)) {
        require_once($file);
    }

    else {
        echo '<br>' . $file . ' im namespace nicht gefunden, suche nun danach, das kann dauern  !';
        checkPathForClass('/home/vk/code/verwaltung/', removeNamespace($className));
    }
}


function checkAndLoadIfIsSet($file) {
    if (file_exists($file)) {
        echo '<br>gefunden !:  ' . $file . '!!';
        echo '<br> wird implementiert, bitte die Datei mit namespace versehen, du Papnase ! !';
        require_once($file);
    }
}

function giveSubdirToPath($path) {
    return glob($path . '/*', GLOB_ONLYDIR);
}


function checkPathForClass($path, $class_name) {
    $file = $path . 'php' . $class_name . '.php';
    // echo '<br>'.$file;
    checkAndLoadIfIsSet($file);
    foreach (giveSubdirToPath($path) as $dir) {
        checkPathForClass($dir, $class_name);
    }
}


function removeNamespace($file) {
    echo '<br> aus ' . $file;
    $file = substr(strrchr($file, "/"), 1);
    echo ' <-mach->' . $file . ' und suche danach';
    return $file;
}

spl_autoload_register('myAutoloader');



