<?php
/**
 * @access protected
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 */
namespace MSBios\Media\CPanel\Doctrine\Filter;

use Imagine\Image\Box;
use Imagine\Image\BoxInterface;
use Imagine\Image\ImageInterface;
use Imagine\Image\ImagineInterface;
use MSBios\Filter\File\RenameUpload;
use Zend\Filter\Callback;
use Zend\Filter\FilterChain;

/**
 * Class NewsImageChain
 * @package MSBios\Media\CPanel\Doctrine\Filter
 */
class NewsImageChain extends FilterChain
{
    /**
     * NewsImageChain constructor.
     * @param ImagineInterface $imagine
     */
    public function __construct(ImagineInterface $imagine)
    {
        parent::__construct();

        $this->attach(new RenameUpload([
            'target' => [
                'pathname' => './public/uploads/',
                'depth' => 4,
                'length' => 2,
                'camel_case' => false
            ],
            'use_upload_name' => false,
            'use_upload_extension' => true,
            'overwrite' => false,
            'randomize' => true,
        ]))->attach(new Callback(function ($params) use ($imagine) {

            /** @var BoxInterface $size */
            $size = new Box(480, 320);

            $imagine->open($params['tmp_name'])
                ->resize($size, ImageInterface::FILTER_UNDEFINED)
                ->save($params['tmp_name']);

            $params['width'] = $size->getWidth();
            $params['height'] = $size->getHeight();

            return $params;

        }))->attach(new Callback(function ($params) use ($imagine) {

            /** @var array $pathinfo */
            $pathinfo = pathinfo($params['tmp_name']);

            /** @var string $targetDir */
            $targetDir = $pathinfo['dirname']
                . DIRECTORY_SEPARATOR . 'thumb';

            if (!is_dir($targetDir)) {
                mkdir($targetDir, 0777, true);
            }

            /** @var string $targetName */
            $targetName = $targetDir
                . DIRECTORY_SEPARATOR . $pathinfo['basename'];

            /** @var BoxInterface $size */
            $size = new Box(320, 270);

            /** @var ImageInterface $image */
            $image = $imagine->open($params['tmp_name'])
                ->thumbnail($size, ImageInterface::THUMBNAIL_OUTBOUND, ImageInterface::FILTER_UNDEFINED)
                ->save($targetName);

            /** @var BoxInterface $box */
            $box = $image->getSize();

            $params['thumb'] = [
                'tmp_name' => $targetName,
                'width' => $box->getWidth(),
                'height' => $box->getHeight()
            ];

            return $params;

        }));
    }
}