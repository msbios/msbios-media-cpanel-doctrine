<?php
/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 */

namespace MSBios\Media\CPanel\Doctrine\Controller;

use Doctrine\ORM\QueryBuilder;
use MSBios\CPanel\Doctrine\Mvc\Controller\AbstractActionController;
use MSBios\Media\CPanel\Doctrine\Filter\NewsImageChain;
use MSBios\Media\Resource\Doctrine\Entity\News;
use MSBios\View\Model\ViewModel;
use Zend\Filter\FilterInterface;
use Zend\Filter\FilterPluginManager;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ModelInterface;

/**
 * Class NewsController
 * @package MSBios\Media\CPanel\Doctrine\Controller
 */
class NewsController extends AbstractActionController
{
    /** @var FilterPluginManager */
    protected $filterPluginManager;

    /**
     * NewsController constructor.
     * @param FilterPluginManager $filterPluginManager
     */
    public function __construct(FilterPluginManager $filterPluginManager)
    {
        $this->filterPluginManager = $filterPluginManager;
        $this->setObjectPrototype(new News);
    }

    /**
     * @override
     *
     * @param string $alias
     * @return QueryBuilder
     */
    protected function getQueryBuilder($alias = 'resource')
    {
        /** @var QueryBuilder $qb */
        return parent::getQueryBuilder($alias)
            ->orderBy('resource.postdate', 'DESC');
    }

    /**
     * @return JsonModel
     */
    public function imageAction()
    {
        /** @var \Zend\Http\Request $request */
        $request = $this->getRequest();

        /** @var array $data */
        $data = array_merge_recursive(
            $request->getPost()->toArray(),
            $request->getFiles()->toArray()
        );

        /** @var FilterInterface $imageFilterChain */
        $imageFilterChain = $this->filterPluginManager->get(NewsImageChain::class);

        /** @var array $data */
        $data = $imageFilterChain->filter($data['attachment']);
        $data['tmp_name'] = substr($data['tmp_name'], strlen('./public'));
        $data['thumb']['tmp_name'] = substr($data['thumb']['tmp_name'], strlen('./public'));

        return new JsonModel($data);
    }
}
