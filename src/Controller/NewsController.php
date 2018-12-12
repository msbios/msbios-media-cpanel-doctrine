<?php
/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 */

namespace MSBios\Media\CPanel\Doctrine\Controller;

use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\QueryBuilder;
use MSBios\CPanel\Doctrine\Mvc\Controller\AbstractActionController;
use MSBios\Media\CPanel\Doctrine\Filter\NewsImageChain;
use MSBios\Media\Resource\Doctrine\Entity\News;
use MSBios\Paginator\Doctrine\Adapter\QueryBuilderPaginator;
use Zend\Filter\FilterInterface;
use Zend\Filter\FilterPluginManager;
use Zend\Form\FormInterface;
use Zend\View\Model\JsonModel;

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
     * @param ObjectManager $dem
     * @param FormInterface $form
     * @param FilterPluginManager $filterPluginManager
     */
    public function __construct(ObjectManager $dem, FormInterface $form, FilterPluginManager $filterPluginManager)
    {
        parent::__construct($dem, $form);
        $this->filterPluginManager = $filterPluginManager;
    }

    /**
     * @param QueryBuilder $queryBuilder
     */
    public function __invoke(QueryBuilder $queryBuilder)
    {

        if ($this->search->isValid()) {
            /** @var array $data */
            $data = $this->search->getData();

            if (! empty($data['q'])) {
                $queryBuilder->where($queryBuilder->expr()->like('n.title', ':name'))
                ->setParameter('name', "{$data['q']}%");
            }
        }

        return new QueryBuilderPaginator($queryBuilder);
    }

    /**
     * @return void|JsonModel
     */
    public function imageAction()
    {
        /** @var \Zend\Http\Request $request */
        $request = $this->getRequest();

        if (! $request->isPost()) {
            return;
        }

        /** @var array $data */
        $data = array_merge_recursive(
            $request->getPost()->toArray(),
            $request->getFiles()->toArray()
        );

        /** @var FilterInterface $imageFilterChain */
        $imageFilterChain = $this->filterPluginManager
            ->get(NewsImageChain::class);

        /** @var array $data */
        $data = $imageFilterChain->filter($data['attachment']);
        $data['tmp_name'] = substr($data['tmp_name'], strlen('./public'));
        $data['thumb']['tmp_name'] = substr($data['thumb']['tmp_name'], strlen('./public'));

        return new JsonModel($data);
    }

    /**
     * @return mixed|News
     */
    protected static function factory()
    {
        return new News;
    }

    /**
     * @inheritdoc
     *
     * @return string
     */
    public function getResourceId()
    {
        return self::class;
    }
}
