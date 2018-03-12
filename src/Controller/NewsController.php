<?php
/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 */
namespace MSBios\Media\CPanel\Doctrine\Controller;

use Doctrine\ORM\QueryBuilder;
use MSBios\CPanel\Doctrine\Mvc\Controller\AbstractActionController;
use MSBios\Media\Resource\Doctrine\Entity\News;

/**
 * Class NewsController
 * @package MSBios\Media\CPanel\Doctrine\Controller
 */
class NewsController extends AbstractActionController
{
    /**
     * NewsController constructor.
     */
    public function __construct()
    {
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
}
