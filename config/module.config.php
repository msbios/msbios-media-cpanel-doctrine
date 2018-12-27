<?php
/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 */

namespace MSBios\Media\CPanel\Doctrine;

use Zend\Router\Http\Method;
use Zend\Router\Http\Segment;

return [

    'router' => [
        'routes' => [
            'cpanel' => [
                'may_terminate' => true,
                'child_routes' => [
                    'news' => [
                        'type' => Segment::class,
                        'options' => [
                            'route' => 'news[/[:action[/[:id[/]]]]]',
                            'defaults' => [
                                'controller' => Controller\NewsController::class,
                            ],
                            'constraints' => [
                                'action' => 'add|edit|drop',
                                'id' => '[0-9]+'
                            ]
                        ]
                    ],
                    'news-image' => [
                        'type' => Segment::class,
                        'options' => [
                            'route' => 'news/image[/]',
                            'defaults' => [
                                'controller' => Controller\NewsController::class,
                                'action' => 'image',
                            ],
                        ],
                        'may_terminate' => true,
                        'child_routes' => [
                            [
                                'type' => Method::class,
                                'options' => [
                                    'verb' => 'post'
                                ]
                            ]
                        ]
                    ],
                ],
            ],
        ],
    ],

    'controllers' => [
        'factories' => [
            Controller\NewsController::class =>
                Factory\NewsControllerFactory::class
        ]
    ],

    'navigation' => [
        \MSBios\CPanel\Navigation\Sidebar::class => [
            'content' => [
                'pages' => [
                    'news' => [
                        'label' => _('News'),
                        'route' => 'cpanel/news',
                    ]
                ]
            ]
        ],
    ],

    'form_elements' => [
        'aliases' => [
            Controller\NewsController::class =>
                \MSBios\Media\Resource\Doctrine\Form\NewsForm::class
        ]
    ],

    'filters' => [
        'factories' => [
            Filter\NewsImageChain::class =>
                Factory\NewsImageChainFactory::class
        ]
    ],

    'translator' => [
        'translation_file_patterns' => [
            [
                'type' => 'gettext',
                'base_dir' => __DIR__ . '/../language',
                'pattern' => '%s.mo'
            ]
        ],
    ],

    \MSBios\Assetic\Module::class => [
        'maps' => [
            // css
            'limitless/msbios.media.cpanel.js' =>
                __DIR__ . '/../themes/limitless/public/msbios.media.cpanel.js',
        ],
    ],

    \MSBios\Theme\Module::class => [
        'themes' => [
            'limitless' => [
                // Template Map
                'template_map' => [
                    'ms-bios/media/c-panel/doctrine/news/add' =>
                        __DIR__ . '/../themes/limitless/view/ms-bios/media/c-panel/doctrine/news/form.phtml',
                    'ms-bios/media/c-panel/doctrine/news/edit' =>
                        __DIR__ . '/../themes/limitless/view/ms-bios/media/c-panel/doctrine/news/form.phtml',

                ],
                // Template Path Stack
                'template_path_stack' => [
                    __DIR__ . '/../themes/limitless/view/',
                ],
                // Controller map
                'controller_map' => [
                    // ...
                ],
                // Translation file patterns
                'translation_file_patterns' => [
                    [
                        'type' => 'gettext',
                        'base_dir' => __DIR__ . '/../themes/limitless/language/',
                        'pattern' => '%s.mo',
                    ],
                ],
                // Widget manager
                'widget_manager' => [
                    'template_map' => [
                        // ...
                    ],
                    'template_path_stack' => [
                        __DIR__ . '/../themes/limitless/widget/'
                    ],
                ],
            ],
        ]
    ],

    \MSBios\Guard\Module::class => [

        'role_providers' => [
            \MSBios\Guard\Provider\RoleProvider::class => [
            ]
        ],

        'resource_providers' => [
            \MSBios\Guard\Provider\ResourceProvider::class => [
                Controller\NewsController::class
            ]
        ],

        'rule_providers' => [
            \MSBios\Guard\Provider\RuleProvider::class => [
                'allow' => [
                    [['DEVELOPER'], Controller\NewsController::class],
                ],
                'deny' => []
            ]
        ],
    ],
];
