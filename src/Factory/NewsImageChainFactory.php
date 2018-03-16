<?php
/**
 * @access protected
 * @author Judz
 */
namespace MSBios\Media\CPanel\Doctrine\Factory;

use Imagine\Gd\Imagine;
use Interop\Container\ContainerInterface;
use MSBios\Imagine\ImaginePluginManager;
use MSBios\Imagine\ImaginePluginManagerInterface;
use MSBios\Media\CPanel\Doctrine\Filter\NewsImageChain;
use Zend\ServiceManager\Factory\FactoryInterface;

/**
 * Class NewsImageChainFactory
 * @package MSBios\Media\CPanel\Doctrine\Factory
 */
class NewsImageChainFactory implements FactoryInterface
{
    /**
     * @param ContainerInterface $container
     * @param string $requestedName
     * @param array|null $options
     * @return NewsImageChain
     */
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
        /** @var ImaginePluginManagerInterface $imagineManager */
        $imagineManager = $container->get(ImaginePluginManager::class);
        return new NewsImageChain(
            $imagineManager->get(Imagine::class)
        );
    }
}
