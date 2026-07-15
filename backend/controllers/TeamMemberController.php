<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\TeamMember;
use Backend\Utils\Cache;
use Backend\Utils\Response;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/TeamMember.php';
require_once __DIR__ . '/../utils/Cache.php';
require_once __DIR__ . '/../utils/Response.php';

final class TeamMemberController extends BaseCrudController
{
    protected string $modelClass = TeamMember::class;
    protected string $resourceName = 'team_members';
    protected array $requiredCreateFields = ['name'];

    public function publicIndex(array $params = []): void
    {
        $data = Cache::remember('public:team_members', static function () {
            $model = new TeamMember();
            return $model->publicActive();
        }, 600);

        Response::success($data, 'Fetched successfully');
    }
}
