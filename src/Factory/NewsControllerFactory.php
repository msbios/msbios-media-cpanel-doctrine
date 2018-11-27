<?php
/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 */
namespace MSBios\Media\CPanel\Doctrine\Factory;

use Doctrine\ORM\EntityManager;
use Interop\Container\ContainerInterface;
use MSBios\Media\CPanel\Doctrine\Controller\NewsController;
use Zend\ServiceManager\Factory\FactoryInterface;

/**
 * Class NewsControllerFactory
 * @package MSBios\Media\CPanel\Doctrine\Factory
 */
class NewsControllerFactory implements FactoryInterface
{
    /**
     * @param ContainerInterface $container
     * @param string $requestedName
     * @param array|null $options
     * @return NewsController|object
     */
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
        return new NewsController(
            $container->get(EntityManager::class),
            $container->get('FormElementManager')->get($requestedName),
            $container->get('FilterManager')
        );
    }
}
