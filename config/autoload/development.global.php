<?php
/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 */

namespace MSBios\Media\CPanel\Doctrine;

return [

    'doctrine' => [
        'connection' => [
            'orm_default' => [
                'params' => [
                    'host' => '127.0.0.1',
                    'user' => 'root',
                    'password' => 'root',
                    'dbname' => 'portal.dev',
                ],
            ],
        ],
        'eventmanager' => [
            'orm_default' => [
                'subscribers' => [
                    \Gedmo\Sluggable\SluggableListener::class,
                ]
            ]
        ],
    ],

    'controllers' => [
        'aliases' => [
            // ...
        ]
    ],

    \MSBios\Assetic\Module::class => [
        'paths' => [
            __DIR__ . '/../../vendor/msbios/application/themes/default/public/',
        ],
    ],

    'view_manager' => [
        'template_path_stack' => [
            __DIR__ . '/../../vendor/msbios/media-doctrine/view',
        ],
    ],
];