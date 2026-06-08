<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\AboutPageSetting;
use Backend\Models\AboutStorySection;
use Backend\Models\AboutProblemCard;
use Backend\Models\AboutMissionSection;
use Backend\Models\AboutCoreValue;
use Backend\Models\AboutComparisonSection;
use Backend\Models\AboutComparisonCard;
use Backend\Models\AboutCtaSection;
use Backend\Utils\ActivityLogger;
use Backend\Utils\Cache;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../models/AboutPageSetting.php';
require_once __DIR__ . '/../models/AboutStorySection.php';
require_once __DIR__ . '/../models/AboutProblemCard.php';
require_once __DIR__ . '/../models/AboutMissionSection.php';
require_once __DIR__ . '/../models/AboutCoreValue.php';
require_once __DIR__ . '/../models/AboutComparisonSection.php';
require_once __DIR__ . '/../models/AboutComparisonCard.php';
require_once __DIR__ . '/../models/AboutCtaSection.php';
require_once __DIR__ . '/../utils/ActivityLogger.php';
require_once __DIR__ . '/../utils/Cache.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

final class AboutController extends BaseController
{
    /* ── helpers ───────────────────────────────────────────── */

    private static function activeCards(string $modelClass): array
    {
        $model = new $modelClass();
        return array_values(array_filter(
            $model->all([]),
            static fn (array $r): bool => (bool) ($r['is_active'] ?? 1)
        ));
    }

    /* ═══════════════════════════════════════════════════════
       PUBLIC ENDPOINTS
    ═══════════════════════════════════════════════════════ */

    public function publicPage(array $params = []): void
    {
        $data = Cache::remember('public:about:page', static function (): array {
            return [
                'hero'       => (new AboutPageSetting())->find(1)     ?? [],
                'story'      => (new AboutStorySection())->find(1)    ?? [],
                'problems'   => self::activeCards(AboutProblemCard::class),
                'mission'    => (new AboutMissionSection())->find(1)  ?? [],
                'core_values'=> self::activeCards(AboutCoreValue::class),
                'comparison' => [
                    'header' => (new AboutComparisonSection())->find(1) ?? [],
                    'cards'  => self::activeCards(AboutComparisonCard::class),
                ],
                'cta'        => (new AboutCtaSection())->find(1)      ?? [],
            ];
        });
        Response::success($data, 'About page data fetched');
    }

    public function publicHero(array $params = []): void
    {
        $data = Cache::remember('public:about:hero', static fn () => (new AboutPageSetting())->find(1) ?? []);
        Response::success($data, 'Fetched');
    }

    public function publicStory(array $params = []): void
    {
        $data = Cache::remember('public:about:story', static fn () => (new AboutStorySection())->find(1) ?? []);
        Response::success($data, 'Fetched');
    }

    public function publicProblems(array $params = []): void
    {
        $data = Cache::remember('public:about:problems', static fn () => self::activeCards(AboutProblemCard::class));
        Response::success($data, 'Fetched');
    }

    public function publicMission(array $params = []): void
    {
        $data = Cache::remember('public:about:mission', static fn () => (new AboutMissionSection())->find(1) ?? []);
        Response::success($data, 'Fetched');
    }

    public function publicCoreValues(array $params = []): void
    {
        $data = Cache::remember('public:about:core-values', static fn () => self::activeCards(AboutCoreValue::class));
        Response::success($data, 'Fetched');
    }

    public function publicComparison(array $params = []): void
    {
        $data = Cache::remember('public:about:comparison', static function (): array {
            return [
                'header' => (new AboutComparisonSection())->find(1) ?? [],
                'cards'  => self::activeCards(AboutComparisonCard::class),
            ];
        });
        Response::success($data, 'Fetched');
    }

    public function publicCta(array $params = []): void
    {
        $data = Cache::remember('public:about:cta', static fn () => (new AboutCtaSection())->find(1) ?? []);
        Response::success($data, 'Fetched');
    }

    /* ═══════════════════════════════════════════════════════
       ADMIN — SINGLE-RECORD SECTIONS
    ═══════════════════════════════════════════════════════ */

    public function adminGetHero(array $params = []): void
    {
        Response::success((new AboutPageSetting())->find(1) ?? [], 'Fetched');
    }

    public function adminUpdateHero(array $params = []): void
    {
        $payload = Validator::sanitizeInput($this->body());
        $result  = (new AboutPageSetting())->saveSingle($payload);
        ActivityLogger::log($this->currentAdminId(), 'update', 'about-hero', 1);
        Cache::clearAll();
        Response::success($result, 'Hero section updated');
    }

    public function adminGetStory(array $params = []): void
    {
        Response::success((new AboutStorySection())->find(1) ?? [], 'Fetched');
    }

    public function adminUpdateStory(array $params = []): void
    {
        $payload = Validator::sanitizeInput($this->body());
        $result  = (new AboutStorySection())->saveSingle($payload);
        ActivityLogger::log($this->currentAdminId(), 'update', 'about-story', 1);
        Cache::clearAll();
        Response::success($result, 'Story section updated');
    }

    public function adminGetMission(array $params = []): void
    {
        Response::success((new AboutMissionSection())->find(1) ?? [], 'Fetched');
    }

    public function adminUpdateMission(array $params = []): void
    {
        $payload = Validator::sanitizeInput($this->body());
        $result  = (new AboutMissionSection())->saveSingle($payload);
        ActivityLogger::log($this->currentAdminId(), 'update', 'about-mission', 1);
        Cache::clearAll();
        Response::success($result, 'Mission section updated');
    }

    public function adminGetComparison(array $params = []): void
    {
        Response::success((new AboutComparisonSection())->find(1) ?? [], 'Fetched');
    }

    public function adminUpdateComparison(array $params = []): void
    {
        $payload = Validator::sanitizeInput($this->body());
        $result  = (new AboutComparisonSection())->saveSingle($payload);
        ActivityLogger::log($this->currentAdminId(), 'update', 'about-comparison', 1);
        Cache::clearAll();
        Response::success($result, 'Comparison header updated');
    }

    public function adminGetCta(array $params = []): void
    {
        Response::success((new AboutCtaSection())->find(1) ?? [], 'Fetched');
    }

    public function adminUpdateCta(array $params = []): void
    {
        $payload = Validator::sanitizeInput($this->body());
        $result  = (new AboutCtaSection())->saveSingle($payload);
        ActivityLogger::log($this->currentAdminId(), 'update', 'about-cta', 1);
        Cache::clearAll();
        Response::success($result, 'CTA section updated');
    }

    /* ═══════════════════════════════════════════════════════
       ADMIN — PROBLEM CARDS (CRUD)
    ═══════════════════════════════════════════════════════ */

    public function adminIndexProblems(array $params = []): void
    {
        $model = new AboutProblemCard();
        Response::success($model->all($this->query()), 'Fetched');
    }

    public function adminStoreProblems(array $params = []): void
    {
        $payload = Validator::sanitizeInput($this->body());
        $errors  = Validator::required($payload, ['title']);
        if ($errors !== []) {
            Response::error('Validation failed', 422, ['fields' => $errors]);
        }

        $model = new AboutProblemCard();
        $id    = $model->create($payload);
        ActivityLogger::log($this->currentAdminId(), 'create', 'about-problem', $id);
        Cache::clearAll();
        Response::success($model->find($id), 'Created', 201);
    }

    public function adminUpdateProblems(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        $this->requireId($id);

        $model = new AboutProblemCard();
        $this->requireExists($model->find($id));

        $payload = Validator::sanitizeInput($this->body());
        $model->update($id, $payload);
        ActivityLogger::log($this->currentAdminId(), 'update', 'about-problem', $id);
        Cache::clearAll();
        Response::success($model->find($id), 'Updated');
    }

    public function adminDeleteProblems(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        $this->requireId($id);

        $model = new AboutProblemCard();
        $this->requireExists($model->find($id));

        $model->delete($id);
        ActivityLogger::log($this->currentAdminId(), 'delete', 'about-problem', $id);
        Cache::clearAll();
        Response::success(null, 'Deleted');
    }

    /* ═══════════════════════════════════════════════════════
       ADMIN — CORE VALUES (CRUD)
    ═══════════════════════════════════════════════════════ */

    public function adminIndexCoreValues(array $params = []): void
    {
        Response::success((new AboutCoreValue())->all($this->query()), 'Fetched');
    }

    public function adminStoreCoreValues(array $params = []): void
    {
        $payload = Validator::sanitizeInput($this->body());
        $errors  = Validator::required($payload, ['title']);
        if ($errors !== []) {
            Response::error('Validation failed', 422, ['fields' => $errors]);
        }

        $model = new AboutCoreValue();
        $id    = $model->create($payload);
        ActivityLogger::log($this->currentAdminId(), 'create', 'about-core-value', $id);
        Cache::clearAll();
        Response::success($model->find($id), 'Created', 201);
    }

    public function adminUpdateCoreValues(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        $this->requireId($id);

        $model = new AboutCoreValue();
        $this->requireExists($model->find($id));

        $model->update($id, Validator::sanitizeInput($this->body()));
        ActivityLogger::log($this->currentAdminId(), 'update', 'about-core-value', $id);
        Cache::clearAll();
        Response::success($model->find($id), 'Updated');
    }

    public function adminDeleteCoreValues(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        $this->requireId($id);

        $model = new AboutCoreValue();
        $this->requireExists($model->find($id));

        $model->delete($id);
        ActivityLogger::log($this->currentAdminId(), 'delete', 'about-core-value', $id);
        Cache::clearAll();
        Response::success(null, 'Deleted');
    }

    /* ═══════════════════════════════════════════════════════
       ADMIN — COMPARISON CARDS (CRUD)
    ═══════════════════════════════════════════════════════ */

    public function adminIndexComparisonCards(array $params = []): void
    {
        Response::success((new AboutComparisonCard())->all($this->query()), 'Fetched');
    }

    public function adminStoreComparisonCards(array $params = []): void
    {
        $payload = Validator::sanitizeInput($this->body());
        $errors  = Validator::required($payload, ['title']);
        if ($errors !== []) {
            Response::error('Validation failed', 422, ['fields' => $errors]);
        }

        $model = new AboutComparisonCard();
        $id    = $model->create($payload);
        ActivityLogger::log($this->currentAdminId(), 'create', 'about-comparison-card', $id);
        Cache::clearAll();
        Response::success($model->find($id), 'Created', 201);
    }

    public function adminUpdateComparisonCards(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        $this->requireId($id);

        $model = new AboutComparisonCard();
        $this->requireExists($model->find($id));

        $model->update($id, Validator::sanitizeInput($this->body()));
        ActivityLogger::log($this->currentAdminId(), 'update', 'about-comparison-card', $id);
        Cache::clearAll();
        Response::success($model->find($id), 'Updated');
    }

    public function adminDeleteComparisonCards(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        $this->requireId($id);

        $model = new AboutComparisonCard();
        $this->requireExists($model->find($id));

        $model->delete($id);
        ActivityLogger::log($this->currentAdminId(), 'delete', 'about-comparison-card', $id);
        Cache::clearAll();
        Response::success(null, 'Deleted');
    }

    /* ── private guards ────────────────────────────────────── */

    private function requireId(int $id): void
    {
        if ($id <= 0) {
            Response::error('Invalid resource ID', 422);
        }
    }

    private function requireExists(?array $row): void
    {
        if ($row === null) {
            Response::error('Resource not found', 404);
        }
    }
}
