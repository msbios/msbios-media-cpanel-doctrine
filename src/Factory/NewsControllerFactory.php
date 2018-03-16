<?php
/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 */
namespace MSBios\Media\CPanel\Doctrine\Factory;

use Interop\Container\ContainerInterface;
use Interop\Container\Exception\ContainerException;
use MSBios\Imagine\ImaginePluginManagerInterface;
use MSBios\Media\CPanel\Doctrine\Controller\NewsController;
use MSBios\Media\CPanel\Doctrine\Filter\NewsImageChain;
use Zend\ServiceManager\Exception\ServiceNotCreatedException;
use Zend\ServiceManager\Exception\ServiceNotFoundException;
use Zend\ServiceManager\Factory\FactoryInterface;

/**
 * Class NewsControllerFactory
 * @package MSBios\Media\CPanel\Doctrine\Factory
 */
class NewsControllerFactory implements FactoryInterface
{
    /**
     * Create an object
     *
     * @param  ContainerInterface $container
     * @param  string $requestedName
     * @param  null|array $options
     * @return object
     * @throws ServiceNotFoundException if unable to resolve the service.
     * @throws ServiceNotCreatedException if an exception is raised when
     *     creating a service.
     * @throws ContainerException if any other error occurs
     */
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
        return new NewsController(
            $container->get('FilterManager')
        );
    }
}
